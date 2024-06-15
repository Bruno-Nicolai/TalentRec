import React from 'react'

import { HttpError, useGetIdentity } from '@refinedev/core';
import { CREATE_DEAL_MUTATION, UPDATE_DEAL_MUTATION } from '@/graphql/mutations';
import { GetFields, GetFieldsFromList, GetVariables } from '@refinedev/nestjs-query';
import { CompanyDealsCompaniesSelectQuery, CompanyDealsModalMutation, CompanyDealsModalMutationVariables, ContactsSelectQuery, DealStagesSelectQuery, UsersSelectQuery } from '@/graphql/types';

import { useModalForm, useSelect } from '@refinedev/antd';
import { Col, Form, Input, InputNumber, Modal, Row, Select, Spin } from 'antd';
import { User } from '@/graphql/schema.types';
import { COMPANY_DEALS_COMPANIES_SELECT_QUERY, CONTACTS_SELECT_QUERY, DEAL_STAGES_SELECT_QUERY, USERS_SELECT_QUERY } from '@/graphql/queries';
import SelectOptionWithAvatar from '@/components/select-option-with-avatar';
import { DollarOutlined } from '@ant-design/icons';

type Props = {
  opened: boolean;
  setOpened: (opened: boolean) => void;
  dealId?: string;
  companyId: string;
};

export const DealsModal = ({ opened, setOpened, dealId, companyId }: Props) => {

  const isEditMode = !!dealId;

  const { data: user } = useGetIdentity<User>();

  const { formProps, modalProps, queryResult: queryResultDeals } = useModalForm<
    GetFields<CompanyDealsModalMutation>,
    HttpError,
    GetVariables<CompanyDealsModalMutationVariables>
  >({
    redirect: false,
    defaultVisible: true,
    mutationMode: "optimistic",
    resource: "deals",
    action: isEditMode ? "edit" : "create",
    id: isEditMode ? dealId : undefined,
    meta: {
      gqlMutation: isEditMode ? UPDATE_DEAL_MUTATION : CREATE_DEAL_MUTATION,
    },    
  });

  const { 
    dealContact, 
    dealOwner, 
    company,
    stage
  } = queryResultDeals?.data?.data ?? {};

  const {
    selectProps: companySelectProps,
    queryResult: queryResultcompanies,
  } = useSelect<GetFieldsFromList<CompanyDealsCompaniesSelectQuery>>({
    resource: "companies",
    optionLabel: "name",
    filters: [
      {
        field: "id",
        operator: "eq",
        value: companyId,
      },
    ],
    meta: {
      gqlQuery: COMPANY_DEALS_COMPANIES_SELECT_QUERY,
    },
  });

  const { 
    selectProps: contactsSelectProps, 
    queryResult: contactsSelect 
  } = useSelect<
    GetFieldsFromList<ContactsSelectQuery>
  >({
    resource: 'contacts',
    optionLabel: 'name',
    filters: [
      {
        field: "company.id",
        operator: "eq",
        value: companyId,
      },
    ],
    meta: {
      gqlQuery: CONTACTS_SELECT_QUERY,
    },
  });

  const { 
    queryResult: queryResultUsers, 
    selectProps: usersSelectProps 
  } = useSelect<GetFieldsFromList<UsersSelectQuery>>({
    resource: "users",
    optionLabel: "name",
    filters: [
      {
        field: "id",
        operator: "eq",
        value: isEditMode ? dealOwner?.id : user?.id,
      },
    ],
    meta: {
      gqlQuery: USERS_SELECT_QUERY,
    },
  });


  const { 
    selectProps: dealStagesSelectProps, 
    queryResult: dealStagesSelect 
  } = useSelect<
    GetFieldsFromList<DealStagesSelectQuery>
  >({
    resource: "dealStages",
    optionLabel: "title",
    meta: { 
      gqlQuery: DEAL_STAGES_SELECT_QUERY 
    },
  });

  if (isEditMode && queryResultDeals?.isLoading) {
    return (
      <Modal
        open={opened}
        onCancel={() => {
          setOpened(false);
        }}
        width={512}
      >
        <Spin />
      </Modal>
    );
  }

  return (
    <Modal
      {...modalProps}
        open={opened}
        onCancel={() => {
          setOpened(false);
        }}
        title={isEditMode ? "Edit deal" : "Add a new deal"}
        width={756}
    >
      <Form
        {...formProps}
        layout="vertical"
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true }]}
        >
          <Input placeholder="Please enter a deal title" />
        </Form.Item>

        <Form.Item
          label="Company"
          name={["companyId"]}
          initialValue={company?.id}
          dependencies={["dealContactId"]}
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Please select company"
            {...companySelectProps}
            options={
              queryResultcompanies.data?.data?.map((company) => ({
                value: company.id,
                label: (
                  <SelectOptionWithAvatar
                    name={company.name}
                    shape="square"
                    avatarUrl={company.avatarUrl ?? undefined}
                  />
                ),
              })) ?? []
            }
          />
        </Form.Item>

        <Row gutter={[32, 32]}>
          <Col xl={8} sm={24} xs={24}>
            <Form.Item
              label="Contact for this Deal"
              name={["dealContactId"]}
              initialValue={dealContact?.id}
              rules={[{ required: true }]}
            >
              <Select
                {...contactsSelectProps}
                placeholder="Contact Name"
                options={
                  contactsSelect.data?.data?.map((contact) => ({
                    value: contact.id,
                    label: (
                      <SelectOptionWithAvatar
                        name={contact.name}
                        shape="circle"
                        avatarUrl={contact.avatarUrl ?? undefined}
                      />
                    ),
                  })) ?? []
                }
              />
            </Form.Item>
          </Col>
          <Col xl={8} sm={24} xs={24}>
            <Form.Item
              label="Deal Owner"
              name={["dealOwnerId"]}
              initialValue={dealOwner?.id}
              rules={[{ required: true }]}
            >
              <Select 
                {...usersSelectProps}
                placeholder="Username"
                disabled={isEditMode}
                options={
                  queryResultUsers.data?.data?.map((user) => ({
                    value: user.id,
                    label: (
                      <SelectOptionWithAvatar
                        name={user.name}
                        shape="circle"
                        avatarUrl={user.avatarUrl ?? undefined}
                      />
                    ),
                  })) ?? []
                }
              />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[32, 32]}>
          <Col xl={8} sm={24} xs={24}>
            <Form.Item 
              label="Stage" 
              name={["stageId"]}
              initialValue={stage?.id}
              rules={[{ required: true }]}
            >
              <Select
                {...dealStagesSelectProps}
                placeholder="Please select stage"
                options={
                  dealStagesSelectProps.options?.concat({
                    value: null,
                    label: "UNASSIGNED",
                  })
                }
                showSearch={false}
              />
            </Form.Item>
          </Col>
          <Col xl={8} sm={24} xs={24}>
            <Form.Item
              label="Deal Value"
              name="value"
            >
              <InputNumber
                min={0}
                addonBefore={<DollarOutlined />}
                placeholder="0,00"
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
              />
            </Form.Item>
          </Col>
        </Row>
        
      </Form>
    </Modal>
  );
};