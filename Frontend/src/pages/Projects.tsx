import React, { useState,useEffect } from 'react';
import CreateProjectModal from '../components/CreateProjectModal';
import ProjectCard from '../components/ProjectCard';
import ProjectDetailsModal from '../components/ProjectDetailsModal';
import { useProjects } from '../hooks/myProject';

export interface Project {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  collaborators?: string[];
  progress: number;
}

const Projects: React.FC = () => {
  
  const [showModal, setShowModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const {projects,loading,error} = useProjects();

  const [project,setProject] = useState<Project[]>([]);

  useEffect(() => {
    if (projects) {
      setProject(projects);
    }
  }, [projects]);

  console.log(projects)
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
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
        {project.map((project, index) => (
          <ProjectCard
            key={index}
            title={project.name}
            description={project.description}
            createdBy={project.createdBy}
            collaborators={[]}
            progress={project.progress}
            onClick={() => setSelectedProject(project)}
          />
        ))}
      </div>

      {/* Project Details Modal */}
      {selectedProject && (
        <ProjectDetailsModal

          {...selectedProject}
          collaborators={selectedProject.collaborators ?? []}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {/* Create Project Modal */}
      {showModal && (
        <CreateProjectModal onClose={() => setShowModal(false)} setProject={setProject} project={project} />
      )}
    </div>
  );
};

export default Projects;
