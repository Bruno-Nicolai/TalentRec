import React from "react";

import { AuthPage } from "@refinedev/antd";

export const UpdatePasswordPage: React.FC = () => {
  return (
    <AuthPage 
      type="updatePassword" 
      title={false}
    />
  );
};