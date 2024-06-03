import React from 'react'

import { UPDATE_COMPANY_MUTATION } from '@/graphql/mutations';
import { COMPANY_TITLE_QUERY } from '@/graphql/queries';
import { UpdateCompanyMutation, UpdateCompanyMutationVariables } from '@/graphql/types';

import { EditOutlined } from '@ant-design/icons';

import { useForm } from '@refinedev/antd';
import { HttpError } from '@refinedev/core';
import { GetFields, GetVariables } from '@refinedev/nestjs-query';
import { Form, Skeleton, Space } from 'antd';

import CustomAvatar from './custom-avatar';
import { getNameInitials } from '@/utilities';
import { Text } from './text';

export const PictureAndTitle = () => {
  
  const { formProps, queryResult, onFinish } = useForm<
    GetFields<UpdateCompanyMutation>,
    HttpError,
    GetVariables<UpdateCompanyMutationVariables>
  >({
    redirect: false,
    meta: {
      gqlMutation: UPDATE_COMPANY_MUTATION,
      gqlQuery: COMPANY_TITLE_QUERY,
    },
  });

  const { avatarUrl, name } = queryResult?.data?.data || {}

  return (
    <Form {...formProps}>
      <Space size={32}>
        <CustomAvatar 
          size="large"
          shape="square"
          src={avatarUrl}
          name={getNameInitials(name || '')}
          style={{
              width: 96,
              height: 96,
              fontSize: 48,
              border: "none",
              marginBottom: '24px',
          }}
        />
        <Space direction="vertical" size={10}>
          <Form.Item name="name" required noStyle>
            <TitleInput
              loading={queryResult?.isLoading}
              onChange={(value: string) => {
                return onFinish?.({
                  name: value,
                });
              }}
            />
          </Form.Item>
        </Space>
      </Space>
    </Form>
  )
}

const TitleInput = ({
  value,
  onChange,
  loading,
}: {
  // value is set by <Form.Item />
  value?: string;
  onChange?: (value: string) => void;
  loading?: boolean;
}) => {
  return (
    <Text
      style={{
        display: "block",
        height: "2.5rem",
        margin: 0,
      }}
      size="xl"
      strong
      editable={{
        onChange,
        triggerType: ["text", "icon"],
        icon: (
          <EditOutlined 
              style={{ 
                  color: "#222", 
              }} 
          />
        ),
      }}
    >
      {loading ? (
        <Skeleton.Input size="small" style={{ width: 200 }} />
      ) : (value)}
    </Text>
  );
};