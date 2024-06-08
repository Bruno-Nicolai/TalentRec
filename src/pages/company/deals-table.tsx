import React, { useMemo } from 'react'
import { useParams } from 'react-router-dom';

import { COMPANY_DEALS_TABLE_QUERY, COMPANY_TOTAL_DEALS_AMOUNT_QUERY, DEAL_STAGES_SELECT_QUERY, USERS_SELECT_QUERY } from '@/graphql/queries';
import { CompanyDealsTableQuery, CompanyTotalDealsAmountQuery, DealStagesSelectQuery, UsersSelectQuery } from '@/graphql/types';
import { EditButton, FilterDropdown, useSelect, useTable } from '@refinedev/antd';
import { GetFields, GetFieldsFromList } from '@refinedev/nestjs-query';

import { AuditOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Input, Select, Skeleton, Space, Table, Tooltip } from 'antd';

import { currencyNumber } from '@/utilities';
import { Text } from '@/components/text';
import { useOne } from '@refinedev/core';
import { DealStageTag } from '@/components/tags/deal-stage-tag';
import CustomAvatar from '@/components/custom-avatar';

type Deal = GetFieldsFromList<CompanyDealsTableQuery>;

export const CompanyDealsTable = () => {

  const params = useParams();

  const { tableProps, filters, setFilters } = useTable<Deal>({
    resource: "deals",
    syncWithLocation: false,
    sorters: {
      initial: [
        {
          field: "updatedAt",
          order: "desc",
        },
      ],
    },
    filters: {
      initial: [
        {
          field: "title",
          value: "",
          operator: "contains",
        },
        {
          field: "stage.id",
          value: "",
          operator: "in",
        },
      ],
      permanent: [
        {
          field: "company.id",
          operator: "eq",
          value: params.id,
        },
      ],
    },
    meta: {
      gqlQuery: COMPANY_DEALS_TABLE_QUERY,
    },
  });  
  
  const { data: companyData, isLoading: isLoadingCompany } = useOne<
    GetFields<CompanyTotalDealsAmountQuery>
  >({
    resource: "companies",
    id: params.id,
    meta: {
      gqlQuery: COMPANY_TOTAL_DEALS_AMOUNT_QUERY,
    },
  });
  
  const { selectProps: usersSelectProps } = useSelect<GetFieldsFromList<UsersSelectQuery>>({
    resource: "users",
    optionLabel: "name",
    meta: {
      gqlQuery: USERS_SELECT_QUERY,
    },
  });

  const { selectProps: dealStagesSelectProps } = useSelect<GetFieldsFromList<DealStagesSelectQuery>>({
    resource: "dealStages",
    meta: { gqlQuery: DEAL_STAGES_SELECT_QUERY },
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

  return (
    <Card
      style={{ marginTop: 32 }}
      headStyle={{
        borderBottom: "1px solid transparent",
        marginBottom: "1px",
      }}
      bodyStyle={{ padding: 0 }}
      title={
        <Space size="middle">
          <AuditOutlined />
          <Text>Deals</Text>

          {showResetFilters?.length > 0 && (
            <Button size="small" onClick={() => setFilters([], "replace")}>
              Reset filters
            </Button>
          )}
        </Space>
      }
      extra={
        <>
          <Text className="tertiary">Total deal amount: </Text>
          {isLoadingCompany ? (
            <Skeleton.Input active size="small" />
          ) : (
            <Text strong>
              {currencyNumber(
                companyData?.data.dealsAggregate?.[0]?.sum?.value || 0,
              )}
            </Text>
          )}
        </>
      }
    >
      {!hasData && (
        <Space
          direction="vertical"
        //   size={64}
          style={{
            padding: 16,
          }}
        >
          <Text>No deals yet</Text>
          {/* <Link to={listUrl("deals")}>
            @ts-expect-error Ant Design Icon's v5.0.1 has an issue with @types/react@^18.2.66
            <PlusCircleOutlined
              style={{
                marginRight: 4,
              }}
            />{" "}
            Add deals through sales pipeline
          </Link> */}
        </Space>
      )}

      {hasData && (
        <Table
          {...tableProps}
          rowKey="id"
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: false,
          }}
        >
          <Table.Column
            title="Deal Title"
            dataIndex="title"
            filterIcon={<SearchOutlined />}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder="Search Title" />
              </FilterDropdown>
            )}
          />
          <Table.Column<Deal>
            title="Deal amount"
            dataIndex="value"
            // sorter
            render={(_, record) => {
              return <Text>{currencyNumber(record.value || 0)}</Text>;
            }}
          />
          <Table.Column<Deal>
            title="Stage"
            dataIndex={["stage", "id"]}
            render={(_, record) => {
              if (!record.stage) return null;

              return <DealStageTag stage={record.stage.title} />;
            }}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Select
                  {...dealStagesSelectProps}
                  style={{ width: "200px" }}
                  mode="multiple"
                  placeholder="Select Stage"
                />
              </FilterDropdown>
            )}
          />
          <Table.Column<Deal>
            dataIndex={["dealOwnerId"]}
            title="Participants"
            render={(_, record) => {
              return (
                <Space
                  size={8}
                  style={{ textTransform: "uppercase" }}
                >
                  <Tooltip title={record.dealOwner.name}>
                    <CustomAvatar
                      size="small"
                      src={record.dealOwner.avatarUrl}
                      name={record.dealOwner.name}
                    />
                  </Tooltip>
                  <Tooltip title={record.dealContact.name}>
                    <CustomAvatar
                      size="small"
                      src={record.dealContact.avatarUrl}
                      name={record.dealContact.name}
                    />
                  </Tooltip>
                </Space>
              );
            }}
            filterDropdown={(props) => {
              return (
                <FilterDropdown {...props}>
                  <Select
                    style={{ width: "200px" }}
                    placeholder="Select Sales Owner"
                    {...usersSelectProps}
                  />
                </FilterDropdown>
              );
            }}
          />
          <Table.Column<Deal>
            dataIndex="id"
            width={18}
            render={(value) => {
              return (
                <EditButton
                  recordItemId={value}
                  hideText
                  size="small"
                  resource="deals"
                  icon={<EditOutlined />}
                />
              );
            }}
          />
        </Table>
      )}
    </Card>
  );
}
