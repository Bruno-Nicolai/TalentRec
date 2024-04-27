import { AuthPage } from "@refinedev/antd";
import { Link } from "react-router-dom";
import { Text } from "@/components/text";
import { GoogleOutlined } from "@ant-design/icons";

export const Login = () => {
  return (
    <AuthPage
      type="login"
      title={false}
      providers={[
        {
          name: "google",
          icon: <GoogleOutlined />,
          label: "Sign in",
        }
      ]}
      formProps={{
        // initialValues: authCredentials,
        
      }}
      registerLink={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "5px",
            padding: "5px",
          }}
        >
          <Text>
            Don't have an account? <Link to="/register" style={{ color: "#FA761E" }}>Register</Link>
          </Text>
        </div>
      }
    />
  );
};
