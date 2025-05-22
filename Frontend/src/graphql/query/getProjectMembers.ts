const GET_PROJECT_MEMBERS = `
  query GetProjectMembers($projectID: String!) {
    getProjectMembers(projectID: $projectID) {
      id
      name
      email
    }
  }
`;

export default GET_PROJECT_MEMBERS;
