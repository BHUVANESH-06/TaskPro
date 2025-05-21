const LOGIN_MUTATION = `
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    id
    name
    email
    token
  }
}`;

export default LOGIN_MUTATION;
