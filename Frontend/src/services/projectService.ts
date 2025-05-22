import CREATE_PROJECT_MUTATION from "../graphql/mutations/createProject";
import MY_PROJECTS_QUERY from "../graphql/query/myProjects";
import ADD_COLLABORATOR_MUTATION from "../graphql/mutations/addCollaborator";
import { GET_INITIAL_COLLABORATORS } from "../graphql/query/initialCollaborators";
import DELETE_PROJECT from "../graphql/mutations/deleteProject";
import GET_PROJECT_MEMBERS from "../graphql/query/getProjectMembers";
export async function createProject(name: string, description: string, ownerId: string) {
  try {
    const response = await fetch('http://localhost:8080/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        query: CREATE_PROJECT_MUTATION,
        variables: { name, description, ownerId }
      }),
    });

    const result = await response.json();
    console.log(result)
    return result.data.createProject;
  } catch (error) {
    console.error("Error creating project:", error);
    return null;
  }
}
export async function fetchMyProjects(ownerId: string) {
  const response = await fetch('http://localhost:8080/query', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: MY_PROJECTS_QUERY,
      variables: { ownerId },
    }),
  });

  const { data, errors } = await response.json();
  console.log(data)
  if (errors) {
    throw new Error(errors.map((e:{message: string} )=> e.message).join(', '));
  }

  return data.myProjects;
}
export const addCollaborator = async (projectId: string, userId: string) => {
  console.log(userId,projectId)
  const response = await fetch('http://localhost:8080/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      query: ADD_COLLABORATOR_MUTATION,
      variables: {
        projectID: projectId, 
        userID: userId,
      },
    }),
  });
  
  const resJson = await response.json();
  console.log(response)

  return resJson.data.addCollaborator;
};
export const getInitialCollaborators = async (projectID: string) => {
  const response = await fetch('http://localhost:8080/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      query: GET_INITIAL_COLLABORATORS,
      variables: {
        projectID,
      },
    }),
  });
  const resJson = await response.json();
  if (resJson.errors) {
    throw new Error(resJson.errors[0].message);
  }

  return resJson.data.collaborators;
};
export const deleteProjectService = async (projectId: string): Promise<boolean> => {
  const res = await fetch('http://localhost:8080/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: DELETE_PROJECT,
      variables: { id: projectId },
    }),
  });

  const result = await res.json();
  console.log(result)
  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data.deleteProject;
};


export const getProjectMembersService = async (projectID: string) => {
  console.log("HI")
  const res = await fetch('http://localhost:8080/query', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: GET_PROJECT_MEMBERS,
      variables: { projectID },
    }),
  });

  const result = await res.json();
  console.log("Fetched Members: ", result);

  if (result.errors) {
    throw new Error(result.errors[0].message);
  }

  return result.data.getProjectMembers;
};
