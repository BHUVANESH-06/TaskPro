const ADD_COLLABORATOR_MUTATION = `
mutation AddCollaborator($projectID: String!, $userID: String!) {
  addCollaborator(projectID: $projectID, userID: $userID) {
    id
    name
    collaborators {
      id
      userId
      role
      joinedAt
    }
  }
}
`;

export default ADD_COLLABORATOR_MUTATION;
