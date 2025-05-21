export const GET_INITIAL_COLLABORATORS = `
  query InitialCollaborators($projectID: String!) {
    collaborators(projectID: $projectID) {
      id
      name
      email
    }
  }
`;
