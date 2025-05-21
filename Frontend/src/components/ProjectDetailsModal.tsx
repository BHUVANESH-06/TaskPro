import React, { useState, useEffect, useRef } from 'react';
import { FaUser } from 'react-icons/fa';
import { useUsers } from '../hooks/useUsers';
import { useAddCollaborator } from '../hooks/addCollaborator';
import { useInitialCollaborators } from '../hooks/useInitialCollaborator';
import { useDeleteProject } from '../hooks/deleteProject';  

export interface ProjectDetailsModalProps {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  onClose: () => void;
}

const ProjectDetailsModal: React.FC<ProjectDetailsModalProps> = ({
  id,
  title,
  description,
  createdBy,
  onClose,
}) => {
  const { collaborators, loading: isLoad, error: isError } = useInitialCollaborators(id);
  const [localCollaborators, setLocalCollaborators] = useState(collaborators);  
  const [newCollaborator, setNewCollaborator] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const { addCollaborator: addCollaboratorService, loading: isAdding, error: addError } = useAddCollaborator();
  const { users, loading, error } = useUsers();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLocalCollaborators(collaborators);
  }, [collaborators]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addCollaborator = async (name: string) => {
    if (name && !localCollaborators.some((c) => c.name === name)) {
      const user = users.find((u) => u.name === name);
      if (!user) {
        alert('User not found');
        return;
      }

      try {
        await addCollaboratorService(id, user.id); 
        setLocalCollaborators((prev) => [...prev, { id: user.id, name: user.name, email: user.email }]);
        setNewCollaborator('');
        setShowDropdown(false);
        alert('Collaborator added successfully!');
      } catch (err) {
        alert('Failed to add collaborator');
      }
    }
  };
  const { deleteProject, loading: deleting } = useDeleteProject();

const handleDelete = async () => {
  const confirmed = window.confirm('Are you sure you want to delete this project? This cannot be undone!');
  if (!confirmed) return;

  try {
    await deleteProject(id);
    alert('Project deleted successfully!');
    onClose();
    window.location.reload(); 
  } catch (err) {
    alert('Failed to delete project.');
  }
};

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>Error loading users: {error.message}</div>;

  const allUsers = users.map((u) => u.name);

  const filteredUsers = allUsers.filter(
    (user) =>
      user.toLowerCase().includes(newCollaborator.toLowerCase()) &&
      !localCollaborators.some((c) => c.name === user)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-xl p-6 relative">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{description}</p>

        <div className="text-sm text-gray-500 mb-4">
          <span className="font-semibold text-gray-700">Created by:</span> {createdBy}
        </div>

        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-2">Collaborators</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {localCollaborators.map((c, index) => (
              <div
                key={index}
                className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-700"
              >
                <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs">
                    {c.name.charAt(0).toUpperCase()}
                </div>
                {c.name}
              </div>
            ))}
          </div>

          <div className="relative" ref={dropdownRef}>
            <input
              value={newCollaborator}
              onChange={(e) => {
                setNewCollaborator(e.target.value);
                setShowDropdown(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newCollaborator.trim()) {
                  addCollaborator(newCollaborator.trim());
                }
              }}
              placeholder="Add collaborator..."
              className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {showDropdown && filteredUsers.length > 0 && (
              <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-md max-h-40 overflow-y-auto">
                {filteredUsers.map((user, idx) => (
                  <li
                    key={idx}
                    className="px-4 py-2 hover:bg-blue-100 cursor-pointer text-sm"
                    onClick={() => addCollaborator(user)}
                  >
                    {user}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition mb-3"
        >
          {deleting ? 'Deleting...' : 'Delete Project'}
        </button>

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
