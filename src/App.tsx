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
import { coffeeTheme } from "./config";
import { UpdatePasswordPage } from "./pages/updatePassword";

function App() {
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
              <Route path="/update-password" element={<UpdatePasswordPage />} />
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
