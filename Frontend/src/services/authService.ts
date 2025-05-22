import REGISTER_MUTATION from "../graphql/mutations/register";
import type { User } from "../types/user";
import LOGIN_MUTATION from "../graphql/mutations/login";

const GRAPHQL_ENDPOINT = "http://localhost:8080/query";

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<User> => {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: REGISTER_MUTATION,
      variables: { name, email, password },
    }),
  });

  const result = await response.json();
  if (result.errors) {
    console.log(result)
    throw new Error(result.errors[0].message);
  }
  return result.data.register;
};

export async function loginUser(email: string, password: string) {
    const response = await fetch("http://localhost:8080/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: LOGIN_MUTATION,
        variables: { email, password }
      })
    });
  
    const data = await response.json();
    console.log(data)
    if (data.errors) {
      throw new Error(data.errors[0].message);
    }
    
    const user = data.data.login;
    
    localStorage.setItem("token", user.token);
    localStorage.setItem("userId", user.id.toString());
    localStorage.setItem("name",user.name);
    return user;
  }
