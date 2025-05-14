import React from 'react';

interface TaskFiltersProps {
  status: string;
  setStatus: (status: string) => void;
  priority: string;
  setPriority: (priority: string) => void;
  project: string;
  setProject: (project:string) => void;
}

const dropdownStyle =
  'appearance-none w-48 px-4 py-2 rounded-lg bg-gray-100 text-sm text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ease-in-out duration-150 shadow-sm';

const arrowIconStyle = {
  backgroundImage:
    "url(\"data:image/svg+xml;utf8,<svg fill='gray' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>\")",
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 0.75rem center',
  backgroundSize: '1.25rem',
};

const TaskFilters: React.FC<TaskFiltersProps> = ({
  status,
  setStatus,
  priority,
  setPriority,
  project,
  setProject
}) => {
  return (
    <div className="flex flex-wrap gap-6 mb-6 items-end">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className={dropdownStyle}
          style={arrowIconStyle}
        >
          <option value="">All Statuses</option>
          <option value="To Do">To Do</option>
          <option value="In Progress">In Progress</option>
          <option value="Done">Done</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Priority</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className={dropdownStyle}
          style={arrowIconStyle}
        >
          <option value="">All Priorities</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Project</label>
        <select
          value={project}
          onChange={(e) => setProject(e.target.value)}
          className={dropdownStyle}
          style={arrowIconStyle}
        >
          <option value="">All Projects</option>
          <option value="Login System">Login System</option>
          <option value="UI">UI</option>
          <option value="Backend">Backend</option>
          {/* Add more as needed */}
        </select>
      </div>
    </div>
  );
};

export default TaskFilters;
