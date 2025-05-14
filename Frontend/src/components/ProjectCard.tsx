import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

interface ProjectCardProps {
  title: string;
  description: string;
  createdBy: string;
  collaborators: string[];
  progress: number;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  description,
  createdBy,
  collaborators,
  progress,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer border rounded-xl shadow-md hover:shadow-lg bg-white p-5 transition duration-200"
    >
      <h3 className="text-lg font-bold text-gray-800 mb-1">{title}</h3>
      <p className="text-sm text-gray-600 truncate">{description}</p>

      {/* Progress */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="w-full h-2 bg-gray-200 rounded-full">
          <div
            className="h-2 bg-blue-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="mt-4 flex items-center space-x-2">
        {collaborators.slice(0, 3).map((name, i) => (
          <div
            key={i}
            className="w-8 h-8 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center text-sm font-semibold"
            title={name}
          >
            {name[0]}
          </div>
        ))}
        {collaborators.length > 3 && (
          <span className="text-sm text-gray-500">+{collaborators.length - 3}</span>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
