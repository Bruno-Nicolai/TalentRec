import { useForm, useSelect } from "@refinedev/antd";
import { HttpError } from "@refinedev/core";
import {
  GetFields,
  GetFieldsFromList,
  GetVariables,
} from "@refinedev/nestjs-query";

import { Button, Form, Select, Space } from "antd";

import {
  UpdateTaskMutation,
  UpdateTaskMutationVariables,
  UsersSelectQuery,
} from "@/graphql/types";

import { USERS_SELECT_QUERY } from "@/graphql/queries";
import { UPDATE_TASK_MUTATION } from "@/graphql/mutations";

type Props = {
  initialValues: {
    userIds?: string[];
  };
  cancelForm: () => void;
};

export const UsersForm = ({ initialValues, cancelForm }: Props) => {
  // use the useForm hook to manage the form to add users to a task (assign task to users)
  const { formProps, saveButtonProps } = useForm<
    GetFields<UpdateTaskMutation>,
    HttpError,
    GetVariables<UpdateTaskMutationVariables>
  >({
    queryOptions: {
      // disable the query to prevent fetching data on component mount
      enabled: false,
    },
    redirect: false, // disable redirection
    onMutationSuccess: () => {
      // when the mutation is successful, call the cancelForm function to close the form
      cancelForm();
    },
    // perform the mutation when the form is submitted
    meta: {
      gqlMutation: UPDATE_TASK_MUTATION,
    },
  });

  // use the useSelect hook to fetch the list of users from the server and display them in a select component
  const { queryResult, selectProps } = useSelect<GetFieldsFromList<UsersSelectQuery>>({
    // specify the resource from which we want to fetch the data
    resource: "users",
    // specify the label for the select component
    optionLabel: "name",
    optionValue: "id",
    // specify the query that should be performed
    meta: {
      gqlQuery: USERS_SELECT_QUERY,
    },
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "end",
        justifyContent: "space-between",
        gap: "12px",
      }}
    >
      <Form
        {...formProps}
        style={{ width: "100%" }}
        initialValues={initialValues}
      >
        <Form.Item 
          noStyle 
          name={["userIds"]}
        >
          <Select
            {...selectProps}
            options={
              queryResult.data?.data?.map((user) => ({
                value: user.id,
                label: user.name
              })) ?? []
            }
            dropdownStyle={{ padding: "0px" }}
            style={{ width: "100%" }}
            mode="multiple"
          />
        </Form.Item>
      </Form>
      <Space>
        <Button type="default" onClick={cancelForm}>
          Cancel
        </Button>
        <Button {...saveButtonProps} type="primary">
          Save
        </Button>
      </Space>
    </div>
  );
};
