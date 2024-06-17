import React, { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom';

import { 
    COMPANY_DEALS_TABLE_QUERY, 
    COMPANY_TOTAL_DEALS_AMOUNT_QUERY, 
    DEAL_STAGES_SELECT_QUERY, 
    USERS_SELECT_QUERY 
} from '@/graphql/queries';
import { 
    CompanyDealsTableQuery, 
    CompanyTotalDealsAmountQuery, 
    DealStagesSelectQuery, 
    UsersSelectQuery 
} from '@/graphql/types';
import { GetFields, GetFieldsFromList } from '@refinedev/nestjs-query';
import { EditButton, FilterDropdown, useSelect, useTable } from '@refinedev/antd';

import { AuditOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Input, Select, Skeleton, Space, Table, Tooltip } from 'antd';

import { currencyNumber } from '@/utilities';
import { Text } from '@/components/text';
import { useOne } from '@refinedev/core';
import { DealStageTag } from '@/components/tags/deal-stage-tag';
import CustomAvatar from '@/components/custom-avatar';
import { DealsModal } from './deals-modal';

type Deal = GetFieldsFromList<CompanyDealsTableQuery>;

type CompanyDealsTableProps = {
  companyId: string
}

export const CompanyDealsTable = ({ companyId }: CompanyDealsTableProps) => {

  const params = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDealId, setCurrentDealId] = useState<string | undefined>();

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

  const openCreateNewDealModal = () => {
    setCurrentDealId(undefined);
    setIsModalOpen(true);
  };

  const openEditDealModal = (dealId: string) => {
    setCurrentDealId(dealId);
    setIsModalOpen(true);
  };

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
          <Text strong size='md'>Dealings History</Text>

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
      actions={[
        <div 
          key="1" 
          style={{ 
            display: 'flex', 
            justifyContent: "flex-end", 
            margin: "0 2rem",
          }}
        >
          <Button 
            type="primary" 
            onClick={openCreateNewDealModal}
          >
            Add Deal
          </Button>
        </div>
      ]}
    >
      {!hasData && (
        <Space
          direction="vertical"
          style={{
            padding: 16,
          }}
        >
          <Text>No deals yet</Text>
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
            sorter
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
            render={(_, record) => {
              return (
                <EditButton
                  recordItemId={record.id}
                  hideText
                  size="small"
                  resource="deals"
                  icon={<EditOutlined />}
                  onClick={() => openEditDealModal(record.id)}
                />
              );
            }}
          />
        </Table>
      )}
      {isModalOpen && (
        <DealsModal
          opened={isModalOpen}
          setOpened={setIsModalOpen}
          dealId={currentDealId}
          companyId={companyId}
        />
      )}
    </Card>
  );
}
