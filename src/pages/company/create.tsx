import { useModalForm, useSelect } from '@refinedev/antd'
import { CompanyList } from './list'
import { Form, Input, Modal, Select } from 'antd'
import { useGo } from '@refinedev/core'
import { CREATE_COMPANY_MUTATION } from '@/graphql/mutations'
import { USERS_SELECT_QUERY } from '@/graphql/queries'
import SelectOptionWithAvatar from '@/components/select-option-with-avatar'
import { GetFieldsFromList } from '@refinedev/nestjs-query'
import { UsersSelectQuery } from '@/graphql/types'

const Create = () => {
    const go = useGo();
    const goToListPage = () => {
        go({
            to: { resource: 'companies', action: 'list' },
            options: { keepQuery: true }, 
            type: 'replace',
        })
    }
    const { formProps, modalProps } = useModalForm({
        action: 'create',
        redirect: false,
        resource: 'companies',
        defaultVisible: true,
        mutationMode: 'pessimistic',
        onMutationSuccess: goToListPage,
        meta: {
            gqlMutation: CREATE_COMPANY_MUTATION,
        },
    })
    const { selectProps, queryResult } = useSelect<GetFieldsFromList<UsersSelectQuery>>({
        resource: 'users',
        optionLabel: 'name',
        meta: {
            gqlQuery: USERS_SELECT_QUERY,
        }
    })
    return (
        <CompanyList>
            <Modal
                {...modalProps}
                mask={true}
                onCancel={goToListPage}
                title="Create Company"
                width={512}
            >
                <Form
                    {...formProps}
                    layout="vertical"
                >
                    <Form.Item
                        label="Company Name"
                        name="name"
                        rules={[{required: true}]}
                    >
                        <Input placeholder="Please enter a name for the company" />
                    </Form.Item>
                    <Form.Item
                        label="Tracer"
                        name="salesOwnerId"
                        rules={[{required: true}]}
                    >
                        <Select 
                            placeholder="Please choose the process moderator" 
                            {...selectProps}
                            options={
                                queryResult.data?.data.map((user) => ({
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
                </Form>
            </Modal>
        </CompanyList>
    );
}

export default Create