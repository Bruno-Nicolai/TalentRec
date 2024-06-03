import { AuthBindings } from "@refinedev/core";

import { API_URL, dataProvider } from "./data";
import { User } from "@/graphql/schema.types";

export const authProvider: AuthBindings = {

    login: async ({ email }) => {
        try {
            // call the login mutation
            // dataProvider.custom is used to make a custom request to the GraphQL API
            // this will call dataProvider which will go through the fetchWrapper function
            const { data } = await dataProvider.custom({
                url: API_URL,
                method: "post",
                headers: {},
                meta: {
                    variables: { email },
                    // pass the email to see if the user exists and if so, return the accessToken
                    rawQuery: `
                        mutation Login($email: String!) {
                            login(loginInput: { email: $email }) {
                                accessToken
                            }
                        }
                    `,
                },
            });

            // save the access token in local storage
            localStorage.setItem("access_token", data.login.accessToken);

            return {
                success: true,
                logout: false,
                redirectTo: "/",
            };
            // }
        } catch (e) {
            const error = e as Error;
            return {
                success: false,
                error: {
                    message: "message" in error ? error.message : "Login failed",
                    name: "name" in error ? error.name : "Invalid email or password",
                },
            };
        }
    },

    check: async () => {

        try {
            // get the identity of the user
            // this is to know if the user is authenticated or not
            await dataProvider.custom ({
                url: API_URL,
                method: "post",
                headers: {},
                meta: {
                    rawQuery: `
                        query Me {
                            me {
                                name
                            }
                        }
                    `,
                },
            });

            // if the user is authenticated, redirect to the home page
            return {
                authenticated: true,
                redirectTo: "/",
            };

        } catch (error) {
            // for any other error, redirect to the login page
            return {
                authenticated: false,
                logout: true,
                redirectTo: "/login",
            };
        }

    },

    // simply remove the accessToken from localStorage for the logout
    logout: async () => {
        
        localStorage.removeItem("access_token");
        return {
            success: true,
            redirectTo: "/login",
        };

    },

    onError: async (error) => {

        // a check to see if the error is an authentication error
        // if so, set logout to true
        if (error.statusCode === "UNAUTHENTICATED") {
            return {
                logout: true,
                ...error,
            };
        }
        return { error };
        
    },

    register: async ({ email, password }) => {

        try {
            await dataProvider.custom({
                url: API_URL,
                method: "post",
                headers: {},
                meta: {
                    variables: { email, password },
                    rawQuery: `
                        mutation register($email: String!, $password: String!) {
                            register(registerInput: {
                                email: $email
                                password: $password
                            }) {
                                id
                                email
                            }
                        }
                    `,
                },
            });
            
            return {
                success: true,
                redirectTo: `/login?email=${email}`, // Redirect to login page after successful registration
            };

        } catch (e) {
            const error = e as Error;
            return {
                success: false,
                error: { 
                    message: "message" in error ? error.message : "Register failed",
                    name: "name" in error ? error.name : "Invalid email or password",
                },
            };
        }
        
    },

    forgotPassword: async () => {
        return {
            success: true,
            redirectTo: "/update-password",
        };
    },

    updatePassword: async () => {
        return {
            success: true,
            redirectTo: "/login",
        };
    },

    getPermissions: async () => null,

    getIdentity: async () => {

        const accessToken = localStorage.getItem("access_token");

        try {
            // call the GraphQL API to get the user information
            // we're using me:any because the GraphQL API doesn't have a type for the me query yet
            // we'll add soime queries and mutations later and change this to User which will be generated by codegen
            const { data } = await dataProvider.custom<{ me: User }>({
                url: API_URL,
                method: "post",
                headers: accessToken
                    ?   {
                            // send the access token in the Authorization header
                            Authorization: `Bearer ${accessToken}`,
                        }
                    :   {},
                meta: {
                    // get the user information such as name, email, etc.
                    rawQuery: `
                        query Me {
                            me {
                                id
                                name
                                email
                                phone
                                jobTitle
                                avatarUrl
                            }
                        }
                    `,
                },
            });

            return data.me;

        } catch (error) {
            return;
        }
    },

};