import CustomAvatar from '@/components/custom-avatar'
import SelectOptionWithAvatar from '@/components/select-option-with-avatar'
import { businessTypeOptions, companySizeOptions, industryOptions } from '@/constants'
import { UPDATE_COMPANY_MUTATION } from '@/graphql/mutations'
import { USERS_SELECT_QUERY } from '@/graphql/queries'
import { UsersSelectQuery } from '@/graphql/types'
import { getNameInitials } from '@/utilities'
import { Edit, useForm, useSelect } from '@refinedev/antd'
import { GetFieldsFromList } from '@refinedev/nestjs-query'
import { Col, Form, Input, InputNumber, Row, Select } from 'antd'
import { CompanyContactsTable } from './contacts-table'

const EditCompanyProfile = () => {
  const { saveButtonProps, formProps, formLoading, queryResult } = useForm({
    redirect: false,
    meta: {
      gqlMutation: UPDATE_COMPANY_MUTATION
    },
  })
  const { avatarUrl, name } = queryResult?.data?.data || {}
  const { selectProps, queryResult: queryResultUsers } = useSelect<GetFieldsFromList<UsersSelectQuery>>({
    resource: 'users',
    optionLabel: 'name',
    pagination: {
      mode: 'off',
    },
    meta: {
      gqlQuery: USERS_SELECT_QUERY,
    }
  })
  return (
    <div>
      <Row gutter={[32, 32]}>
        <Col
          xs={24}
          sm={12}
        >
          <Edit 
            isLoading={formLoading}
            saveButtonProps={saveButtonProps}
            breadcrumb={false}
          >
            <Form
              {...formProps}
              layout='vertical'
            >
              <CustomAvatar 
                shape="square"
                src={avatarUrl}
                name={getNameInitials(name || '')}
                style={{
                  width: 96,
                  height: 96,
                  marginBottom: '24px',
                }}
              />
              <Form.Item
                  label="Responsible"
                  name="salesOwnerId"
                  initialValue={formProps?.initialValues?.salesOwner?.id}
              >
                <Select 
                    placeholder="Please choose the process moderator" 
                    {...selectProps}
                    options={
                        queryResultUsers.data?.data.map((user) => ({
                            // 03:25:21
                            value: user.id,
                            label: (
                                <SelectOptionWithAvatar 
                                    name={user.name}
                                    avatarUrl={user.avatarUrl ?? undefined}
                                />
                            )
                        })) ?? []
                    }
                />
              </Form.Item>
              <Form.Item label="Company Size">
                <Select options={ companySizeOptions } />
              </Form.Item>
              <Form.Item label="Niche Market">
                <Select options={ industryOptions } />
              </Form.Item>
              <Form.Item label="Company Details">
                <Input.TextArea 
                  maxLength={800} 
                  autoSize={{ maxRows: 5, }} 
                  allowClear 
                />
              </Form.Item>
              <Form.Item label="Job Description / Requisites">
                <Input.TextArea 
                  maxLength={800} 
                  autoSize={{ maxRows: 5 }} 
                  allowClear 
                />
              </Form.Item>
              <Form.Item label="Annual Revenue">
                <InputNumber 
                  autoFocus
                  addonBefore='$'
                  min={0}
                  placeholder="0.00"
                />
              </Form.Item>
              <Form.Item label="Business Type">
                <Select options={ businessTypeOptions } />
              </Form.Item>
              <Form.Item label="Country" name="country">
                <Input placeholder="Country" />
              </Form.Item>
              <Form.Item label="Company page" name="website">
                <Input placeholder="Website" />
              </Form.Item>
              <Form.Item label="Opportunity" name="opportunity">
                <Input placeholder="Opportunity link" />
              </Form.Item>
            </Form>
          </Edit>
        </Col>
        <Col xs={24} sm={12}>
          <CompanyContactsTable />
        </Col>
      </Row>
    </div>
  )
}

export default EditCompanyProfile
// 03:46:50