import { ThemedLayoutV2, ThemedSiderV2, ThemedTitleV2 } from "@refinedev/antd"
import Header from "./header"
import { Divider } from "antd"
import { LeftSquareOutlined, RightSquareOutlined } from "@ant-design/icons";

const CustomSider = () => (
  <ThemedSiderV2 
    fixed
    Title={(titleProps) => (
      <ThemedTitleV2 {...titleProps} icon={null} text="TalentRec"/>
    )}  
    render={({ items, logout }) => {
      return (
        <>
          {items}
          <Divider />
          {logout}
        </>
      );
    }}
    activeItemDisabled
    meta={{
      expandIcon: <RightSquareOutlined />,
      collapseIcon: <LeftSquareOutlined />,
    }}
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