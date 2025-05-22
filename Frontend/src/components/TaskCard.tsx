import React from 'react';
import type { Task } from '../types/task';

interface Props {
  task: Task;
  onClick: () => void;
}

const priorityColor = {
  HIGH: 'bg-red-500',
  MEDIUM: 'bg-yellow-400',
  LOW: 'bg-green-500',
};

const TaskCard: React.FC<Props> = ({ task, onClick }) => {
  return (
    <div
      className="bg-white p-4 rounded-lg shadow hover:shadow-md transition cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-center mb-5">
        <span className={`w-3 h-3 rounded-full ${priorityColor[task.priority]}`} />
        <span className="text-sm text-gray-500">{task.dueDate}</span>
      </div>
      <h3 className="font-semibold mt-2 text-gray-800">{task.title}</h3>
      <div className="text-xs text-gray-500 mt-1">Assigned to: {localStorage.getItem("name")}</div>
      {task.progress !== undefined && (
        <div className="mt-2 bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full"
            style={{ width: `${task.progress}%` }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
