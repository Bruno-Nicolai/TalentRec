import { FC, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { FilterDropdown, SaveButton, useTable } from "@refinedev/antd";
import { GetFields, GetFieldsFromList } from "@refinedev/nestjs-query";

import {
  DeleteOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusCircleOutlined,
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Card, Col, Form, Input, Row, Select, Space, Table, Tooltip, message } from "antd";

import { statusOptions } from "@/constants";
import { COMPANY_CONTACTS_GET_COMPANY_QUERY, COMPANY_CONTACTS_TABLE_QUERY } from "@/graphql/queries";

import { ContactCreateInput } from "@/graphql/schema.types";
import { 
  CompanyContactsGetCompanyQuery,
  CompanyContactsTableQuery 
} from "@/graphql/types";

import { Text } from "@/components/text";
import CustomAvatar from "@/components/custom-avatar";
import { ContactStatusTag } from "@/components/tags/contact-status-tag";
import { HttpError, useCreateMany, useOne } from "@refinedev/core";
import { coffeeTheme } from "@/config";
import { ContactShowPage } from "./show-contact";

type Contact = GetFieldsFromList<CompanyContactsTableQuery>;

export const CompanyContactsTable: FC = () => {
  // get params from the url
  const params = useParams();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);

  /**
   * Refine offers a TanStack Table adapter with @refinedev/react-table that allows us to use the TanStack Table library with Refine.
   * All features such as sorting, filtering, and pagination come out of the box
   * Under the hood it uses useList hook to fetch the data.
   * https://refine.dev/docs/packages/tanstack-table/use-table/#installation
   */
  const { tableProps, filters, setFilters } = useTable<Contact>({
    resource: "contacts",
    syncWithLocation: false,
    // specify initial sorters
    sorters: {
      /**
       * initial sets the initial value of sorters.
       * it's not permanent
       * it will be cleared when the user changes the sorting
       * https://refine.dev/docs/ui-integrations/ant-design/hooks/use-table/#sortersinitial
       */
      initial: [
        {
          field: "createdAt",
          order: "desc",
        },
      ],
    },
    // specify initial filters
    filters: {
      /**
       * similar to initial in sorters
       * https://refine.dev/docs/ui-integrations/ant-design/hooks/use-table/#filtersinitial
       */
      initial: [
        {
          field: "jobTitle",
          value: "",
          operator: "contains",
        },
        {
          field: "name",
          value: "",
          operator: "contains",
        },
        {
          field: "status",
          value: undefined,
          operator: "in",
        },
      ],
      /**
       * permanent filters are the filters that are always applied
       * https://refine.dev/docs/ui-integrations/ant-design/hooks/use-table/#filterspermanent
       */
      permanent: [
        {
          field: "company.id",
          operator: "eq",
          value: params?.id as string,
        },
      ],
    },
    meta: {
      gqlQuery: COMPANY_CONTACTS_TABLE_QUERY,
    },
  });

  const hasData = tableProps.loading
    ? true
    : (tableProps?.dataSource?.length || 0) > 0;

  const showResetFilters = useMemo(() => {
    return filters?.filter((filter) => {
      if ("field" in filter && filter.field === "company.id") {
        return false;
      }

      if (!filter.value) {
        return false;
      }

      return true;
    });
  }, [filters]);

  const handleRowClick = (record: Contact) => {
    if (!record) {
      setSelectedContactId(null);
    }
    setSelectedContactId(record.id);
    setDrawerOpen(true);
  };

  return (
    <Card
      headStyle={{
        borderBottom: "1px solid transparent",
        marginBottom: "1px",
      }}
      bodyStyle={{ padding: 0 }}
      title={
        <Space size="middle">

          <TeamOutlined />
          <Text>Contacts</Text>
          
          {showResetFilters?.length > 0 && (
            <Button size="small" onClick={() => setFilters([], "replace")}>
              Reset filters
            </Button>
          )}
        
        </Space>
      }
      actions={[<ContactForm key="1" />]}
      // property used to render additional content in the top-right corner of the card
      extra={
        <>
          <Text>Total contacts: </Text>
          <Text strong>
            {/* if pagination is not disabled and total is provided then show the total */}
            {tableProps?.pagination !== false && tableProps.pagination?.total}
          </Text>
        </>
      }
    >
      {!hasData && (
        <div
          style={{
            padding: 16,
            borderBottom: "1px solid transparent",
          }}
        >
          <Text>There are no contacts yet</Text>
        </div>
      )}
      {hasData && (
        <Table
          {...tableProps}
          rowKey="id"
          onRow={(record) => ({
            onDoubleClick: () => handleRowClick(record),
            onTouchEnd: () => handleRowClick(record),
          })}
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: false, // hide the page size changer
          }}
        >
          <Table.Column<Contact>
            title="Name"
            dataIndex="name"
            render={(_, record) => (
              <Space>
                <CustomAvatar name={record.name} src={record.avatarUrl} />
                <Text
                  style={{
                    whiteSpace: "nowrap",
                  }}
                >
                  {record.name}
                </Text>
              </Space>
            )}
            // specify the icon that should be used for filtering
            filterIcon={<SearchOutlined />}
            // render the filter dropdown
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder="Search Name" />
              </FilterDropdown>
            )}
          />
          <Table.Column
            title="Title"
            dataIndex="jobTitle"
            filterIcon={<SearchOutlined />}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder="Search Title" />
              </FilterDropdown>
            )}
          />
          <Table.Column<Contact>
            title="Stage"
            dataIndex="status"
            // render the status tag for each contact
            render={(_, record) => <ContactStatusTag status={record.status} />}
            // allow filtering by selecting multiple status options
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Select
                  style={{ width: "200px" }}
                  mode="multiple" // allow multiple selection
                  placeholder="Select Stage"
                  options={statusOptions}
                ></Select>
              </FilterDropdown>
            )}
          />
          <Table.Column<Contact>
            dataIndex="id"
            width={112}
            render={(_, record) => (
              <Space>
                <Tooltip 
                  title={
                    record.email.length > 20 
                      ? record.email.substring(0, 20) + '...' 
                      : record.email
                  } 
                >
                  <Button
                    size="small"
                    onClick={() => {
                      navigator.clipboard.writeText(record.email).then(() => {
                        message.success('Email copied to clipboard!');
                      }).catch(() => {
                        message.error('Failed to copy email.');
                      });
                    }}
                    icon={<MailOutlined />}
                  />
                </Tooltip>
                <Tooltip
                  title={
                    record.phone && record.phone.length > 20 
                      ? record.phone.substring(0, 20) + '...' 
                      : record.phone
                  } 
                >
                  <Button
                    size="small"
                    onClick={() => {
                      if (!record.phone) {
                        return;
                      }
                      navigator.clipboard.writeText(record.phone).then(() => {
                        message.success('Phone number copied to clipboard!');
                      }).catch(() => {
                        message.error('Failed to copy phone number.');
                      });
                    }}
                    icon={<PhoneOutlined />}
                  />
                </Tooltip>
              </Space>
            )}
          />
        </Table>
      )}
      {selectedContactId && (
        <ContactShowPage 
          opened={drawerOpen} 
          setOpened={setDrawerOpen} 
          contactId={selectedContactId} 
        />
      )}
    </Card>
  );
};

type ContactFormValues = {
  contacts: ContactCreateInput[];
};

const ContactForm = () => {

  const { id = "" } = useParams();

  const { data } = useOne<GetFields<CompanyContactsGetCompanyQuery>>({
    id,
    resource: "companies",
    meta: {
      gqlQuery: COMPANY_CONTACTS_GET_COMPANY_QUERY,
    },
  });

  const [form] = Form.useForm<ContactFormValues>();
  const contacts = Form.useWatch("contacts", form);

  const { mutateAsync } = useCreateMany<
    Contact,
    HttpError,
    ContactCreateInput
  >();

  const handleOnFinish = async (args: ContactFormValues) => {
    form.validateFields();

    const contacts = args.contacts.map((contact) => ({
      ...contact,
      companyId: id,
      salesOwnerId: data?.data.salesOwner?.id || "",
    }));

    await mutateAsync({
      resource: "contacts",
      values: contacts,
      successNotification: false,
    });

    form.resetFields();
  };

  const { hasContacts } = useMemo(() => {
    const hasContacts = contacts?.length > 0;

    return {
      hasContacts,
    };
  }, [contacts]);

  return (
    <Form form={form} onFinish={handleOnFinish}>
      <Form.List name="contacts">
        {(fields, { add, remove }) => {
          return (
            <div
              style={{
                display: "flex",
                alignItems: "flex-start ",
                flexDirection: "column",
                gap: "16px",
                padding: "4px 16px",
              }}
            >
              {fields.map(({ key, name, ...restField }) => {
                return (
                  <Row
                    key={key}
                    gutter={[8, 16]}
                    align="middle"
                    style={{
                      width: "100%",
                    }}
                  >
                    <Col span={9}>
                      <Form.Item
                        {...restField}
                        style={{
                          marginBottom: 0,
                        }}
                        rules={[
                          {
                            required: true,
                            message: "You need to provide a contact name",
                          },
                        ]}
                        name={[name, "name"]}
                      >
                        <Input
                          addonBefore={<UserOutlined />}
                          placeholder="Name"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={9}>
                      <Form.Item
                        required
                        style={{
                          marginBottom: 0,
                        }}
                        rules={[
                          {
                            required: true,
                            message: "Please provide a contact e-mail",
                          },
                        ]}
                        name={[name, "email"]}
                      >
                        <Input
                          addonBefore={<MailOutlined />}
                          placeholder="Email"
                        />
                      </Form.Item>
                    </Col>
                    <Col span={2}>
                      <Button
                        icon={<DeleteOutlined />}
                        onClick={() => remove(name)}
                      />
                    </Col>
                  </Row>
                );
              })}
              <Button
                type="link"
                icon={<PlusCircleOutlined />}
                onClick={() => add()}
                style={{
                  color: coffeeTheme.token?.colorPrimary,
                  marginBottom: hasContacts ? 12 : 0,
                }}
              >
                Add new contact
              </Button>
            </div>
          );
        }}
      </Form.List>
      {hasContacts && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
            padding: "16px",
            borderTop: "1px solid #FFEDD6",
          }}
        >
          <Button
            size="large"
            type="default"
            onClick={() => {
              form.resetFields();
            }}
          >
            Cancel
          </Button>
          <SaveButton
            size="large"
            icon={undefined}
            onClick={() => form.submit()}
          />
        </div>
      )}
    </Form>
  );

};
