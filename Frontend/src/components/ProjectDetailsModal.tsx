import React from 'react';
import { FaUser } from 'react-icons/fa';

interface ProjectDetailsModalProps {
  title: string;
  description: string;
  createdBy: string;
  collaborators: string[];
  onClose: () => void;
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  title,
  description,
  createdBy,
  collaborators,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 x-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 relative">

        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{description}</p>

        <div className="text-sm text-gray-500 mb-4">
          <span className="font-semibold text-gray-700">Created by:</span> {createdBy}
        </div>

        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">Collaborators</p>
          <div className="flex flex-wrap gap-2">
            {collaborators.map((name, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700"
              >
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                  {name.charAt(0).toUpperCase()}
                </div>
                {name}
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ProjectDetailsModal;
