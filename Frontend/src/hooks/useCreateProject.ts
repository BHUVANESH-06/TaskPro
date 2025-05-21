import { createProject } from "../services/projectService";

export const useCreateProject = () =>{
  return async (name: string, description: string) => {
    
    const ownerId = localStorage.getItem("userId");
    console.log(name,description,ownerId)
    if (!ownerId) {
      console.error("No owner ID found in localStorage");
      return null;
    }

    return await createProject(name, description, ownerId);
  };
}
