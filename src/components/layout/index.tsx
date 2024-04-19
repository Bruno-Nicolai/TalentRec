import { ThemedLayoutV2, ThemedSiderV2, ThemedTitleV2 } from "@refinedev/antd"
import Header from "./header"
import { Divider } from "antd";

const CustomSider = (siderProps: any) => (
  <ThemedSiderV2 
    {...siderProps} 
    fixed 
    render={({ items, logout }) => {
      return (
        <>
          {items}
          <Divider />
          {logout}
        </>
      );
    }}
    Title={(titleProps: any) => (
      <ThemedTitleV2 {...titleProps} icon={null} text="TalentRec"/>
    )} 
  />
)

const Layout = ({ children }: React.PropsWithChildren) => {
  return (
    <ThemedLayoutV2
        Header={Header}
        Sider={CustomSider}
    >
      {children}
    </ThemedLayoutV2>
  )
}

export default Layout // 05:28:26