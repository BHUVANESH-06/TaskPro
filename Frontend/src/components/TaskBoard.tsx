import React, { useState,useEffect } from 'react';
import type { Task, TaskStatus } from '../types/task';
import TaskCard from './TaskCard';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  tasks: Task[];
  onSelectTask: (task: Task) => void;
  setTasks: (tasks: Task[]) => void;
}

const columns: TaskStatus[] = ['TODO', 'IN_PROGRESS', 'DONE'];

const TaskBoard: React.FC<Props> = ({ tasks, onSelectTask, setTasks }) => {
  console.log(tasks)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
  
    if (!over) return;
  
    const activeTask = tasks.find((t) => t.id === active.id);
    const overTask = tasks.find((t) => t.id === over.id);
    console.log('Before', tasks);
    console.log('Active Task:', activeTask);
    console.log('Over Task:', overTask);
  
    if (!activeTask || !overTask) return;
  
    // If task is moved to another column
    if (activeTask.status !== overTask.status) {
      const updatedTasks = tasks.map((t) =>
        t.id === activeTask.id ? { ...t, status: overTask.status } : t
      );
      console.log('Updated tasks (status change):', updatedTasks);
      setTasks([...updatedTasks]); 
    } else {
      // If task is reordered within the same column
      const columnTasks = tasks.filter((t) => t.status === activeTask.status);
      const oldIndex = columnTasks.findIndex((t) => t.id === active.id);
      const newIndex = columnTasks.findIndex((t) => t.id === over.id);
  
      const sorted = arrayMove(columnTasks, oldIndex, newIndex);
  
      const updatedTasks = tasks
        .filter((t) => t.status !== activeTask.status)
        .concat(sorted);
  
      console.log('Updated tasks (reordering):', updatedTasks);
      setTasks([...updatedTasks]); 
      console.log('after',tasks)
    }
  };
  
  
  useEffect(() => {
    console.log('Updated tasks after state change:', tasks);
  }, [tasks]);
  

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {columns.map((col) => {
          const columnTasks = tasks.filter((t) => t.status === col);

          return (
            <div key={col} className="bg-[#f1f5f9] rounded-lg p-4 min-h-[300px]">
              <h2 className="font-bold mb-2">{col}</h2>
              <SortableContext items={columnTasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {columnTasks.map((task) => (
                    <SortableTaskCard key={task.id} task={task} onClick={() => onSelectTask(task)} />
                  ))}
                </div>
              </SortableContext>
            </div>
          );
        })}
      </div>
    </DndContext>
  );
};

export default TaskBoard;

interface SortableCardProps {
  task: Task;
  onClick: () => void;
}

const SortableTaskCard: React.FC<SortableCardProps> = ({ task, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={onClick}>
      <TaskCard task={task} onClick={onClick}/>
    </div>
  );
};
