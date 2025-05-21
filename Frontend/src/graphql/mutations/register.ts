const REGISTER_MUTATION = `
mutation Register($name: String!, $email: String!, $password: String!) {
  register(name: $name, email: $email, password: $password) {
    id
    name
    email
  }
}`;

export default REGISTER_MUTATION;
