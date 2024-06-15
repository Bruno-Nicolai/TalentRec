import gql from "graphql-tag";

// Mutation to update user
export const UPDATE_USER_MUTATION = gql`
  # The ! after the type means that it is required
  mutation UpdateUser($input: UpdateOneUserInput!) {
    # call the updateOneUser mutation with the input and pass the $input argument
    # $variableName is a convention for GraphQL variables
    updateOneUser(input: $input) {
      id
      name
      avatarUrl
      email
      phone
      jobTitle
    }
  }
`;

// Mutation to create company
export const CREATE_COMPANY_MUTATION = gql`
  mutation CreateCompany($input: CreateOneCompanyInput!) {
    createOneCompany(input: $input) {
      id
      salesOwner {
        id
      }
    }
  }
`;

// Mutation to update company details
export const UPDATE_COMPANY_MUTATION = gql`
  mutation UpdateCompany($input: UpdateOneCompanyInput!) {
    updateOneCompany(input: $input) {
      id
      name
      totalRevenue
      industry
      companySize
      businessType
      country
      website
      avatarUrl
      salesOwner {
        id
        name
        avatarUrl
      }
    }
  }
`;

// Mutation to update contact details of a company
export const UPDATE_CONTACT_MUTATION = gql`
  mutation UpdateContact($input: UpdateOneContactInput!) {
    updateOneContact(input: $input) {
      id
      name
      email
      jobTitle
      phone
      timezone
      avatarUrl
      createdAt
      status
    }
  }
`;

// Mutation to update a deal
export const CREATE_DEAL_MUTATION = gql`
  mutation CreateDeal($input: CreateOneDealInput!) {
    createOneDeal(input: $input) {
      id
      title
      company {
        id
        name
        contacts {
          nodes {
            id
            name
            avatarUrl
          }
        }
      }
      stageId
      value
      dealOwnerId
      dealContact {
        id
      }
    }
  }
`;

// Mutation to update a deal
export const UPDATE_DEAL_MUTATION = gql`
  mutation UpdateDeal($input: UpdateOneDealInput!) {
    updateOneDeal(input: $input) {
      id
      title
      company {
        id
        name
        contacts {
          nodes {
            id
            name
            avatarUrl
          }
        }
      }
      stageId
      value
      dealOwnerId
      dealContact {
        id
      }
    }
  }
`;

// Mutation to update task stage of a task
export const UPDATE_TASK_STAGE_MUTATION = gql`
  mutation UpdateTaskStage($input: UpdateOneTaskInput!) {
    updateOneTask(input: $input) {
      id
    }
  }
`;

// Mutation to create a new task
export const CREATE_TASK_MUTATION = gql`
  mutation CreateTask($input: CreateOneTaskInput!) {
    createOneTask(input: $input) {
      id
      title
      stage {
        id
        title
      }
    }
  }
`;

// Mutation to update a task details
export const UPDATE_TASK_MUTATION = gql`
  mutation UpdateTask($input: UpdateOneTaskInput!) {
    updateOneTask(input: $input) {
      id
      title
      completed
      description
      dueDate
      stage {
        id
        title
      }
      users {
        id
        name
        avatarUrl
      }
      checklist {
        title
        checked
      }
    }
  }
`;