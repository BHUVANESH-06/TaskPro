import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { useCreateProject } from '../hooks/useCreateProject';
import { createProject } from '../services/projectService';
import type { Project } from '../pages/Projects';
interface Props {
  onClose: () => void;
  setProject: (projects: Project[])=> void;
  project: Project[];
}

const CreateProjectModal: React.FC<Props> = ({ onClose, setProject,project }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [collaborators, setCollaborators] = useState<string[]>([]);
  const createProject = useCreateProject();
  const allCollaborators = ['Chullu', 'Shanu', 'Kavi', 'Deepa', 'Ravi', 'Meera']; 

  const handleCollaboratorChange = (event: React.ChangeEvent<HTMLInputElement>, name: string) => {
    if (event.target.checked) {
      setCollaborators((prev) => [...prev, name]);
    } else {
      setCollaborators((prev) => prev.filter((collab) => collab !== name));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const createdProject = await createProject(title,description);
    if(createdProject){
      setProject([...project, createdProject])
      console.log("Project created,",createdProject);
      onClose();
    }else{
      alert("Failed");
    }
    
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg w-[90%] max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-gray-800">Create New Project</h2>
          <button onClick={onClose} className="font-bold text-xl cursor-pointer hover:scale-120 transition-all"><FaTimes/></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm py-2 font-medium text-gray-700">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm py-2 font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full border px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm py-2 font-medium text-gray-700">Collaborators</label>
            <div className="space-y-2">
              {allCollaborators.map((collaborator) => (
                <div key={collaborator} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={collaborators.includes(collaborator)}
                    onChange={(e) => handleCollaboratorChange(e, collaborator)}
                    id={`collaborator-${collaborator}`}
                    className="w-4 h-4 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor={`collaborator-${collaborator}`} className="ml-2 text-sm text-gray-700">
                    {collaborator}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 cursor-pointer"
          >
            Create Project
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
