import { Authenticated, Refine } from "@refinedev/core";

import { useNotificationProvider } from "@refinedev/antd";
import "@refinedev/antd/dist/reset.css";

import { authProvider, dataProvider, liveProvider } from "./providers"
import { Login, Register, ForgotPassword, Home, CompanyList } from "./pages"

import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import { App as AntdApp, ConfigProvider } from "antd";
import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import Layout from "./components/layout";
import { resources } from "./config/resources";
import Create from "./pages/company/create";
import Edit from "./pages/company/edit";
import TaskList from "./pages/task/list";
import TaskCreate from "./pages/task/create";
import TaskEdit from "./pages/task/edit";

function App() {

  const coffeeTheme = {
    components: {
      Typography: {
        colorText: "#0D0D02",
        colorTextHeading: "#0D0D02",
      },
      Dropdown: {
        sizePopupArrow: 0,
        colorBgElevated: "#FDFDF2",
      },
      Popover: {
        sizePopupArrow: 0,
        colorBgElevated: "#FDFDF2",
      },
      Modal: {
        colorBgElevated: "#FDFDF2",
      },
      Layout: {
        siderBg: "#000",
      },
      Table: {
        headerBorderRadius: 4,
        headerBg: "#994F00",
        colorTextHeading: "#FDFDFD",
        colorBgContainer: "#FDFDF2",
        colorText: "#0D0D02",
        headerFilterHoverBg: "#FDFDF2",
        colorTextDescription: "#0D0D02",
        rowHoverBg: "#ecdcbe",
      },
      Card: {
        colorBgContainer: "#FED6A9",
      },
      Empty: {
        controlHeightLG: 0,
        fontSize: 21,
      },
      Alert: {
        colorBgElevated: "#0D0D02",
        colorText: "#FDFDF2",
        colorTextHeading: "#FDFDF2",
        colorIcon: "#FDFDF2",
        colorIconHover: "#FA761E",
        colorInfo: "#FED6A9",
      },
      Notification: {
        colorBgElevated: "#0D0D02",
        colorText: "#FDFDF2",
        colorTextHeading: "#FDFDF2",
        colorIcon: "#FDFDF2",
        colorIconHover: "#FA761E",
        colorInfo: "#FED6A9",
      },
    },
    token: {
      colorPrimary: "#FA761E",
      colorBgLayout: "#FFEDD6",
      colorError: "#FA003F",
      colorSuccess: "#41CD7D",
    }, 
  }

  return (
    <BrowserRouter>
      <AntdApp>
        <ConfigProvider 
          theme={coffeeTheme}
        >
          <Refine
            dataProvider={dataProvider}
            liveProvider={liveProvider}
            notificationProvider={useNotificationProvider}
            routerProvider={routerBindings}
            authProvider={authProvider}
            resources={resources}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              useNewQueryKeys: true,
              projectId: "rKckSM-gIGA2g-1QkK3b",
              liveMode: "auto",
            }}
          >
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route
                element={
                  <Authenticated
                    key="authenticated-layout"
                    fallback={<CatchAllNavigate to="/login"/>}
                  >
                    <Layout>
                      <Outlet />
                    </Layout>
                  </Authenticated>
                }>
                  <Route index element={<Home />} />
                  <Route path="/companies" >
                    <Route index element={<CompanyList />} />
                    <Route path="new" element={<Create />} />
                    <Route path="edit/:id" element={<Edit />} />
                  </Route>
                  <Route path="/tasks" element={
                    <TaskList>
                      <Outlet />
                    </TaskList> 
                  }>
                    <Route path="new" element={<TaskCreate />} />
                    <Route path="edit/:id" element={<TaskEdit />} />
                  </Route>
              </Route>
            </Routes>
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
        </ConfigProvider>
      </AntdApp>
    </BrowserRouter>
  );
}

export default App;
