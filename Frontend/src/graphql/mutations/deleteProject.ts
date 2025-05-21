const DELETE_PROJECT = `
  mutation DeleteProject($id: String!) {
    deleteProject(id: $id)
  }
`;

export default DELETE_PROJECT;
