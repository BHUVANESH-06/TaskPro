const CREATE_TASK_MUTATION = `
mutation createTask(
  $projectId: String!,
  $title: String!,
  $description: String,
  $status: TaskStatus!,
  $priority: TaskPriority!,
  $dueDate: String,
  $assignedToId: String
) {
  createTask(
    projectId: $projectId,
    title: $title,
    description: $description,
    status: $status,
    priority: $priority,
    dueDate: $dueDate,
    assignedToId: $assignedToId
  ) {
    id              
    title
    description
    status
    priority
    dueDate
    createdAt
    updatedAt
    assignedTo {
      id            
    }
  }
}`;
export default CREATE_TASK_MUTATION;
