import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

const dashboardData = {
  totalProjects: 6,
  leaderProjects: 2,
  totalTasks: 25,
  completedTasks: 12,
  tasksByStatus: [
    { status: 'To Do', count: 8 },
    { status: 'In Progress', count: 5 },
    { status: 'Completed', count: 12 }
  ],
  tasksByPriority: [
    { priority: 'High', count: 10 },
    { priority: 'Medium', count: 9 },
    { priority: 'Low', count: 6 }
  ],
  taskCompletionOverTime: [
    { date: 'Week 1', completed: 3 },
    { date: 'Week 2', completed: 5 },
    { date: 'Week 3', completed: 8 },
    { date: 'Week 4', completed: 12 }
  ],
  taskEfficiency: [
    { date: 'Week 1', tasksCompleted: 3 },
    { date: 'Week 2', tasksCompleted: 4 },
    { date: 'Week 3', tasksCompleted: 6 },
    { date: 'Week 4', tasksCompleted: 7 }
  ],
  predictedCompletion: [
    { date: 'Week 1', predicted: 5 },
    { date: 'Week 2', predicted: 8 },
    { date: 'Week 3', predicted: 10 },
    { date: 'Week 4', predicted: 12 }
  ],
  tasksByDepartment: [
    { department: 'Marketing', count: 8 },
    { department: 'Development', count: 10 },
    { department: 'Design', count: 7 }
  ],
  comparison: [
    { month: 'Last Month', completed: 8 },
    { month: 'This Month', completed: 12 }
  ]
};

const StatCard = ({ title, value }: { title: string; value: string | number }) => (
  <div className="bg-white rounded-2xl shadow p-4 flex flex-col items-start w-full">
    <span className="text-sm text-gray-500">{title}</span>
    <span className="text-xl font-bold text-gray-800">{value}</span>
  </div>
);

const SortableWidget = ({ id, children }: { id: string; children: React.ReactNode }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {children}
    </div>
  );
};

const Dashboard = () => {
  const [widgets, setWidgets] = useState(['status', 'priority', 'trend', 'efficiency', 'predicted', 'department', 'comparison']);
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = widgets.indexOf(active.id);
      const newIndex = widgets.indexOf(over.id);
      setWidgets(arrayMove(widgets, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-6 px-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Projects" value={dashboardData.totalProjects} />
        <StatCard title="Tasks Assigned" value={dashboardData.totalTasks} />
        <StatCard title="Tasks Completed" value={dashboardData.completedTasks} />
        <StatCard title="Leader in Projects" value={dashboardData.leaderProjects} />
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={widgets} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {widgets.map((widget) => (
              <SortableWidget key={widget} id={widget}>
                {widget === 'status' && (
                  <WidgetCard title="Task Status">
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={dashboardData.tasksByStatus}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="status" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#6366F1" />
                      </BarChart>
                    </ResponsiveContainer>
                  </WidgetCard>
                )}
                {widget === 'priority' && (
                  <WidgetCard title="Tasks by Priority">
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={dashboardData.tasksByPriority}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="priority" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#F59E0B" />
                      </BarChart>
                    </ResponsiveContainer>
                  </WidgetCard>
                )}
                {widget === 'trend' && (
                  <WidgetCard title="Task Completion Over Time">
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={dashboardData.taskCompletionOverTime}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="completed" stroke="#10B981" />
                      </LineChart>
                    </ResponsiveContainer>
                  </WidgetCard>
                )}
                {widget === 'efficiency' && (
                  <WidgetCard title="Task Efficiency">
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={dashboardData.taskEfficiency}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="tasksCompleted" stroke="#3B82F6" />
                      </LineChart>
                    </ResponsiveContainer>
                  </WidgetCard>
                )}
                {widget === 'predicted' && (
                  <WidgetCard title="Predicted Task Completion">
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={dashboardData.predictedCompletion}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="predicted" stroke="#EF4444" />
                      </LineChart>
                    </ResponsiveContainer>
                  </WidgetCard>
                )}
                {widget === 'department' && (
                  <WidgetCard title="Tasks by Department">
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={dashboardData.tasksByDepartment}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="department" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#8B5CF6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </WidgetCard>
                )}
                {widget === 'comparison' && (
                  <WidgetCard title="Comparison (This Month vs Last Month)">
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={dashboardData.comparison}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="completed" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </WidgetCard>
                )}
              </SortableWidget>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

const WidgetCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-2xl shadow p-4">
    <h2 className="text-lg font-medium mb-4">{title}</h2>
    {children}
  </div>
);

export default Dashboard;
