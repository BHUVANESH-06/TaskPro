const GET_TASKS_BY_ASSIGNED_TO = `
  query TasksByAssignedTo($assignedToId: String!) {
    tasksByAssignedTo(assignedToId: $assignedToId) {
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
      project {
        id
      }
    }
  }
`;

export default GET_TASKS_BY_ASSIGNED_TO;
