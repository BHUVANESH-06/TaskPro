import React, { useState } from 'react';
import CreateProjectModal from '../components/CreateProjectModal';
import ProjectCard from '../components/ProjectCard';
import ProjectDetailsModal from '../components/ProjectDetailsModal';

const Projects: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const projects = [
    {
      title: 'ERP Tool',
      description: 'Manage student records and fees.',
      createdBy: 'Bhuvi',
      collaborators: ['Chullu', 'Shanu', 'Kavi', 'Deepa'],
      progress: 64,
    },
    {
      title: 'Inventory Management System',
      description: 'Track inventory and orders for e-commerce.',
      createdBy: 'Kavi',
      collaborators: ['Bhuvi', 'Ravi', 'Meera'],
      progress: 45,
    },
    {
      title: 'Customer Relationship Management (CRM)',
      description: 'Manage customer interactions and data.',
      createdBy: 'Shanu',
      collaborators: ['Chullu', 'Meera', 'Deepa'],
      progress: 78,
    },
    {
      title: 'AI-Powered Analytics',
      description: 'Leverage AI to analyze business data.',
      createdBy: 'Ravi',
      collaborators: ['Kavi', 'Bhuvi', 'Deepa'],
      progress: 90,
    },
    {
      title: 'Project Management Tool',
      description: 'Track project progress and tasks.',
      createdBy: 'Meera',
      collaborators: ['Shanu', 'Ravi', 'Chullu'],
      progress: 52,
    },
    {
      title: 'E-Learning Platform',
      description: 'A platform to host online courses and lectures.',
      createdBy: 'Deepa',
      collaborators: ['Bhuvi', 'Kavi', 'Shanu'],
      progress: 33,
    },
  ];

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-6 w-full max-w-[1200px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Create Project
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <ProjectCard
            key={index}
            title={project.title}
            description={project.description}
            createdBy={project.createdBy}
            collaborators={project.collaborators}
            progress={project.progress}
            onClick={() => setSelectedProject(project)}
          />
        ))}
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectDetailsModal
          {...selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* Create Project Modal */}
      {showModal && (
        <CreateProjectModal onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};

export default Projects;
