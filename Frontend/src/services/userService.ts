import { GET_USERS_QUERY } from "../graphql/query/user";

export const getUsers = async () => {
  const response = await fetch('http://localhost:8080/query', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: GET_USERS_QUERY,
    }),
  });

  const resJson = await response.json();
  if (resJson.errors) {
    throw new Error(resJson.errors.map((e: any) => e.message).join(', '));
  }

  return resJson.data.users; // returns array of users
};
