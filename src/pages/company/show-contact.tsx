import { HttpError, useDelete } from "@refinedev/core";
import { GetFields, GetVariables } from "@refinedev/nestjs-query";

import {
  CloseOutlined,
  DeleteOutlined,
  IdcardOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  SignatureOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Drawer,
  Form,
  Input,
  Select,
  Spin,
} from "antd";
import dayjs from "dayjs";

import type { Contact } from "@/graphql/schema.types";
import { UpdateContactMutation, UpdateContactMutationVariables } from "@/graphql/types";
import CustomAvatar from "@/components/custom-avatar";
import { Text } from "@/components/text";
import { coffeeTheme } from "@/config";
import { getNameInitials } from "@/utilities";
import { SaveButton, useForm } from "@refinedev/antd";
import { UPDATE_CONTACT_MUTATION } from "@/graphql/mutations";
import { ContactStatus } from "@/components/contacts/status";

const TimezoneEnum = {
  "UTC (Coordinated Universal Time)": "UTC (Coordinated Universal Time)",
  "GMT (Greenwich Mean Time)": "GMT (Greenwich Mean Time)",
  "EST (Eastern Standard Time)": "EST (Eastern Standard Time)",
  "CST (Central Standard Time)": "CST (Central Standard Time)",
  "MST (Mountain Standard Time)": "MST (Mountain Standard Time)",
  "PST (Pacific Standard Time)": "PST (Pacific Standard Time)",
  "CET (Central European Time)": "CET (Central European Time)",
  "IST (Indian Standard Time)": "IST (Indian Standard Time)",
  "JST (Japan Standard Time)": "JST (Japan Standard Time)",
  "AEST (Australian Eastern Standard Time)": "AEST (Australian Eastern Standard Time)",
};

const timezoneOptions = Object.entries(TimezoneEnum).map(([key, value]) => ({
  label: value,
  value: key,
}));

type Props = {
  opened: boolean;
  setOpened: (opened: boolean) => void;
  contactId: string;
};

export const ContactShowPage = ({ opened, setOpened, contactId }: Props) => {

  const { saveButtonProps, formProps, queryResult } = useForm<
    GetFields<UpdateContactMutation>,
    HttpError,
    GetVariables<UpdateContactMutationVariables>
  >({
    redirect: false,
    mutationMode: "optimistic",
    resource: 'contacts',
    action: 'edit',
    id: contactId,
    meta: {
      gqlMutation: UPDATE_CONTACT_MUTATION,
    },
  });

  const { mutate: deleteMutation } = useDelete<Contact>();

  const closeModal = () => {
    setOpened(false);
  };

  if (queryResult?.isLoading) {
    return (
      <Drawer
        open={opened}
        width={756}
        styles={{
          body: {
            background: "#f5f5f5",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }
        }}
      >
        <Spin />
      </Drawer>
    );
  }

  const {
    name,
    timezone,
    avatarUrl,
    createdAt,
  } = queryResult?.data?.data ?? {};

  return (
    <Drawer
      onClose={closeModal}
      open={opened}
      width={756}
      styles={{
        body: { 
          background: coffeeTheme.token?.colorBgLayout, 
          padding: 0 
        },
        header: { display: "none" },
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: 'center',
          justifyContent: "space-between",
          padding: "16px 32px 0",
        }}
      >
        <Text strong>Created on: {dayjs(createdAt).format("MMMM DD, YYYY")}</Text>
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={() => closeModal()}
        />
      </div>
      <div style={{ padding: "16px", }}>
        <Card>
          <Form layout="vertical" {...formProps}>

            <CustomAvatar
              style={{
                margin: ".8rem 1rem 2rem",
                flexShrink: 0,
                fontSize: "40px",
              }}
              size={96}
              src={avatarUrl}
              name={getNameInitials(name || "")}
            />
              
            <div >
              {queryResult?.data?.data?.id ? (
                <ContactStatus contact={queryResult?.data?.data} />
              ) : (
                <p>Loading contact data...</p>
              )}
            </div>

            <Form.Item 
              label="Name" 
              name="name"
              style={{
                marginBottom: '.8rem'
              }}
            >
              <Input 
                placeholder="Contact Name" 
                addonBefore={<SignatureOutlined />} 
              />
            </Form.Item>

            <Form.Item
              label={"Email"}
              name={"email"}
              style={{
                marginBottom: '.8rem'
              }}
            >
              <Input 
                placeholder={"Email"}
                addonBefore={<MailOutlined />} 
              />
            </Form.Item>

            <Form.Item
              name={"jobTitle"}
              label={"Title"}
              style={{
                marginBottom: '.8rem'
              }}
            >
              <Input 
                placeholder={"Title in Company"}
                addonBefore={<IdcardOutlined />} 
              />
            </Form.Item>
            
            <Form.Item
              name={"phone"}
              label={"Phone"}
              style={{
                marginBottom: '.8rem'
              }}
            >
              <Input 
                placeholder={"Phone"}
                addonBefore={<PhoneOutlined />} 
              />
            </Form.Item>

            <Form.Item
              style={{ borderBottom: "none", marginBottom: '.8rem' }}
              name={"timezone"}
              label={"Timezone"}
            >
              <Select
                placeholder={"xxx"}
                defaultValue={timezone} 
                suffixIcon={<GlobalOutlined />} 
                style={{ width: "100%" }}
                options={timezoneOptions}
              />
            </Form.Item>

            <div style={{ 
              display: "flex", 
              justifyContent: "flex-end", 
              gap: ".5rem", 
              padding: "1rem .25rem .25rem", 
              borderTop: "1px solid #FFEDD6" 
            }}>
              <Button 
                type="link" 
                danger 
                icon={<DeleteOutlined />}
                onClick={() => {
                  deleteMutation(
                    {
                      id: contactId,
                      resource: "contacts",
                    },
                    {
                      onSuccess: () => closeModal(),
                    },
                  );
                }}
              >Delete Contact</Button>
              <SaveButton
                {...saveButtonProps}
                style={{
                  display: "block",
                  marginLeft: "auto",
                }}
              />
            </div>

          </Form>
        </Card>
      </div>
    </Drawer>
  );
};