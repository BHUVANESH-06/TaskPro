import CREATE_TASK_MUTATION from "../graphql/mutations/createTask";
import GET_TASKS_BY_ASSIGNED_TO from "../graphql/query/getTasksByAssignedTo";
import type { Task } from "../types/task";
export const taskService = async (
    title: string,
    description: string,
    dueDate: string,
    priority: string,
    projectId: string,
    status: string,
    assignedToId: string,
) =>{
    const res = await fetch("http://localhost:8080/query",{
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        query: CREATE_TASK_MUTATION,
        variables: {
            projectId,
            title,
            description,
            status,
            priority,
            dueDate,
            assignedToId,
        },
        }),
    })
    const result = await res.json();
    console.log("Task Created: ", result);

    if (result.errors) {
        throw new Error(result.errors[0].message);
    }
    return result.data.createTask as Task;
}

export const fetchTasksByAssignedTo = async (assignedToId: string) => {
    const res = await fetch("http://localhost:8080/query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: GET_TASKS_BY_ASSIGNED_TO,
        variables: {
          assignedToId,
        },
      }),
    });
  
    const result = await res.json();
    console.log(result)
    if (result.errors) {
      throw new Error(result.errors[0].message);
    }
  
    return result.data.tasksByAssignedTo;
  };
