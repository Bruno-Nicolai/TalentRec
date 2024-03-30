import { CreateButton, List } from "@refinedev/antd"
import { useGo } from "@refinedev/core"

export const CompanyList = () => {
  const go = useGo();
  return (
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
    ></List>
  )
}
