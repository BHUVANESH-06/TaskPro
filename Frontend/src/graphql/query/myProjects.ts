const MY_PROJECTS_QUERY = `
  query MyProjects($ownerId: String!) {
    myProjects(ownerId: $ownerId) {
      id
      name
      description
      progress
      owner {
        id
      }
      createdAt
      updatedAt
    }
  }
`;

export default MY_PROJECTS_QUERY
