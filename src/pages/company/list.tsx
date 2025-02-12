import CustomAvatar from "@/components/custom-avatar";
import { Text } from "@/components/text";
import { COMPANIES_LIST_QUERY } from "@/graphql/queries";
import { Company } from "@/graphql/schema.types";
import { CompaniesListQuery } from "@/graphql/types";
import { SearchOutlined } from "@ant-design/icons";
import { CreateButton, DeleteButton, EditButton, FilterDropdown, List, useTable } from "@refinedev/antd";
import { HttpError, getDefaultFilter, useGo } from "@refinedev/core";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import { Input, Space, Table } from "antd";

export const CompanyList = ({ children }: React.PropsWithChildren) => {
  const go = useGo();
  const { tableProps, filters } = useTable<
    GetFieldsFromList<CompaniesListQuery>,
    HttpError,
    GetFieldsFromList<CompaniesListQuery>
  >({
    resource: 'companies',
    pagination: {
      pageSize: 28,
    },
    sorters: {
      initial: [
        {
          field: 'createdAt',
          order: 'desc',
        }
      ],
    },
    filters: {
      initial: [
        {
          field: 'name',
          operator: 'contains',
          value: undefined,
        }
      ],
    },
    onSearch: (values) => {
      return [
        {
          field: 'name',
          operator: 'contains',
          value: values.name,
        }
      ]
    },
    meta: {
      gqlQuery: COMPANIES_LIST_QUERY
    },
  });
  return (
    <div>    
      <List
        breadcrumb={false}
        headerButtons={() => (
          <CreateButton 
            onClick={() => {
              go({
                to: {
                  resource: 'companies',
                  action: 'create',
                },
                options: {
                  keepQuery: true,
                },
                type: 'replace', //there are three types: push, replace, reload
              })
            }}
          />
        )}
      >
        <Table
          {...tableProps}
          pagination={{
            ...tableProps.pagination,
          }}
        >
          <Table.Column<Company> 
            dataIndex="name"
            title="Company Name"
            defaultFilteredValue={getDefaultFilter('id', filters)}
            filterIcon={<SearchOutlined />}
            filterDropdown={(props) => (
              <FilterDropdown {...props}>
                <Input placeholder="Search Company" />
              </FilterDropdown>
            )}
            render={(value, record) => (
              <Space>
                <CustomAvatar 
                  shape="square"
                  src={record.avatarUrl}
                  name={record.name}  
                />
                <Text style={{  whiteSpace: 'nowrap' }}>
                  {record.name}
                </Text>
              </Space>
            )}
          />
          <Table.Column<Company> 
            dataIndex="id"
            title="Actions"
            fixed="right"
            align="end"
            render={(value) => (
              <Space>
                <EditButton 
                  hideText
                  size="small"
                  recordItemId={value}
                />
                <DeleteButton 
                  hideText
                  size="small"
                  recordItemId={value}
                />
              </Space>
            )}
          />
        </Table>
      </List>
      {children}
    </div>
  )
}
