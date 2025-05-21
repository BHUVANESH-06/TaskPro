const CREATE_PROJECT_MUTATION = `
mutation CreateProject($name: String!, $description: String, $ownerId: ID!) {
  createProject(name: $name, description: $description, ownerId: $ownerId) {
    id
    name
    description
  }
}`;

export default CREATE_PROJECT_MUTATION;
