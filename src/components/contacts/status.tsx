import { useUpdate } from "@refinedev/core";
import { GetFields } from "@refinedev/nestjs-query";

import {
  DownOutlined,
} from "@ant-design/icons";
import { Dropdown } from "antd";

import { ContactShowQuery } from "@/graphql/types";
import { coffeeTheme } from "@/config";

const ContactStatusEnum = {
  NEW: "NEW",
  CONTACTED: "CONTACTED",
  INTERESTED: "INTERESTED",
  UNQUALIFIED: "UNQUALIFIED",
  QUALIFIED: "QUALIFIED",
  NEGOTIATION: "NEGOTIATION",
  LOST: "LOST",
  WON: "WON",
  CHURNED: "CHURNED",
};

type Props = {
  contact: GetFields<ContactShowQuery>;
};

export const ContactStatus = ({ contact }: Props) => {
  const { mutate } = useUpdate();
  const { status } = contact;

  const updateStatus = (status: string) => {
    mutate({
      resource: "contacts",
      mutationMode: "optimistic",
      id: contact.id,
      values: {
        status,
      },
    });
  };

  return (
    <div>
      <ul
        style={{ 
          margin: "1.6rem 0",
          padding: 0,
          display: "flex",
          listStyleType: "none",
          width: "100%",
          borderRadius: "4px",
          overflow: "hidden",
        }}
      >
        <li
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            height: "40px",
            borderRight: "0.35px solid #f0f2f5",
            backgroundColor: status === "NEW" ? "#089c83" : "#fff",
          }}
        >
          <a
            style={{
              color: status === "NEW" ? "#fff" : "#000",
              fontSize: "12px",
            }}
            onClick={() => {
              updateStatus(ContactStatusEnum.NEW);
            }}
          >
            New
          </a>
        </li>
        <li
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            height: "40px",
            borderRight: "0.5px solid #f0f2f5",
            backgroundColor: status === "CONTACTED" ? "#089c83" : "#fff",
          }}
        >
          <a
            style={{
              color: status === "CONTACTED" ? "#fff" : "#000",
              fontSize: "12px",
            }}
            onClick={() => {
              updateStatus(ContactStatusEnum.CONTACTED);
            }}
          >
            Contacted
          </a>
        </li>
        <li
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            height: "40px",
            borderRight: "0.5px solid #f0f2f5",
            backgroundColor: status === "INTERESTED" ? "#089c83" : status === "UNQUALIFIED" ? coffeeTheme.token?.colorError : "#fff",
          }}
        >
          <Dropdown
            arrow
            trigger={["click"]}
            placement="bottomRight"
            menu={{
              onClick: ({ key }) => {
                updateStatus(key);
              },
              items: [
                {
                  label: "Interested",
                  key: ContactStatusEnum.INTERESTED,
                },
                {
                  label: "Unqualified",
                  key: ContactStatusEnum.UNQUALIFIED,
                  danger: true,
                },
              ],
            }}
          >
            <a
              style={{
                color: status === "INTERESTED" || status === "UNQUALIFIED" ? "#fff" : "#000",
                fontSize: "12px",
              }}
            >
              {status === ContactStatusEnum.UNQUALIFIED ? "Unqualified" : "Interested"}
              <DownOutlined style={{ marginLeft: "0.2rem" }} />
            </a>
          </Dropdown>
        </li>
        <li
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            height: "40px",
            borderRight: "0.5px solid #f0f2f5",
            backgroundColor: status === "QUALIFIED" ? "#09d947" : "#fff",
          }}
        >
          <a
            style={{
              color: status === "QUALIFIED" ? "#fff" : "#000",
              fontSize: "12px",
            }}
            onClick={() => {
              updateStatus(ContactStatusEnum.QUALIFIED);
            }}
          >
            Qualified
          </a>
        </li>
        <li
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            height: "40px",
            borderRight: "0.5px solid #f0f2f5",
            backgroundColor: status === "NEGOTIATION" ? "#09d947" : status === "LOST" ? coffeeTheme.token?.colorError : "#fff",
          }}
        >
          <Dropdown
            arrow
            trigger={["click"]}
            placement="bottomRight"
            menu={{
              onClick: ({ key }) => {
                updateStatus(key);
              },
              items: [
                {
                  label: "Negotiation",
                  key: ContactStatusEnum.NEGOTIATION,
                },
                {
                  label: "Lost",
                  key: ContactStatusEnum.LOST,
                  danger: true,
                },
              ],
            }}
          >
            <a
              style={{
                color: status === "NEGOTIATION" || status === "LOST" ? "#fff" : "#000",
                fontSize: "12px",
              }}
            >
              {status === ContactStatusEnum.LOST ? "Lost" : "Negotiation"}
              <DownOutlined style={{ marginLeft: "0.2rem" }} />
            </a>
          </Dropdown>
        </li>
        <li
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            height: "40px",
            borderRight: "0.5px solid #f0f2f5",
            backgroundColor: status === "WON" ? coffeeTheme.token?.colorSuccess : status === "CHURNED" ? coffeeTheme.token?.colorError : "#fff",
          }}
        >
          <Dropdown
            arrow
            trigger={["click"]}
            placement="bottomRight"
            menu={{
              onClick: ({ key }) => {
                updateStatus(key);
              },
              items: [
                {
                  label: "Won",
                  key: ContactStatusEnum.WON,
                },
                {
                  label: "Churned",
                  key: ContactStatusEnum.CHURNED,
                  danger: true,
                },
              ],
            }}
          >
            <a
              style={{
                color: status === "WON" || status === "CHURNED" ? "#fff" : "#000",
                fontSize: "12px",
              }}
            >
              {status === ContactStatusEnum.CHURNED ? "Churned" : "Won"}
              <DownOutlined style={{ marginLeft: "0.2rem" }} />
            </a>
          </Dropdown>
        </li>
      </ul>
    </div>
  );
};