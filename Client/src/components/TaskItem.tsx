import React, { useState } from 'react';
import AddTask from './AddTask';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteTask } from '../api/user.api'

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'To Do' | 'In Progress' | 'Completed';
  creatorId?: any,
  assignedToId: any;
}

interface TaskItemProps {
  task: Task
}

const getPriorityColor = (p: string) => {
  if (p === 'High') return 'text-red-400 bg-red-400/10 border-red-400/20';
  if (p === 'Medium') return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
  return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
};

const getStatusColor = (s: string) => {
  if (s === 'Completed') return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
  if (s === 'In Progress') return 'text-purple-400 bg-purple-400/10 border-purple-400/20';
  return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
};

export default function TaskItem({ task }: TaskItemProps) {

  const [displayEditTask, setDisplayEditTask] = useState(false)
  const handleUpdateTask = async(task) => {
    setDisplayEditTask(true)
  }  
  const queryClient = useQueryClient()

  const deleteTaskQuery = useMutation({
    mutationKey: ['deleteTask'],
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['AllTasks']
      })
    }
  })

  const handleDelete = async (_id:string) => {
    deleteTaskQuery.mutate(_id)
  }
  
  
  return (
    <div className="group flex flex-col md:flex-row md:items-start justify-between p-4 mb-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-200 hover:shadow-lg hover:shadow-black/40">
      {
        displayEditTask && 
        <AddTask 
          existingtask= {{
            _id: task._id,
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            priority: task.priority,
            status: task.status,
            assignedToId: task.assignedToId._id}}
          setDisplayAddTaskForm= {setDisplayEditTask}
        />
      }
      
      <div className="flex-1 min-w-0 pr-4 mb-4 md:mb-0">
        <div className="flex flex-wrap items-center gap-3 mb-2">
          <h3 className="text-white font-medium text-lg">{task.title}</h3>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
            {task.priority}
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(task.status)}`}>
            {task.status}
          </span>
        </div>

        <p className="text-gray-400 text-sm mb-3 line-clamp-2 leading-relaxed">
          {task.description}
        </p>
        
        <div className="flex flex-col md:flex-row justify-start md:items-center gap-4 text-xs text-gray-500 font-mono">
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Due: {(new Date(task.dueDate)).toLocaleDateString('en-US', {month: 'long', day: 'numeric', year: 'numeric',}) }</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span  >{`By: ${task.creatorId.fullname}`}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span >{`To: ${task.assignedToId.fullname}`}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 self-center md:self-start mt-2 md:mt-0">
        <button 
          onClick={() => handleUpdateTask(task)}
          className="btn btn-neutral text-xs px-3 py-1.5 h-auto"
          title="Reassign Task"
        >
          Update
        </button>
        <button 
          onClick={() => handleDelete(task._id)}
          className="btn btn-danger text-xs px-3 py-1.5 h-auto"
          title="Delete Task"
        >
          Delete
        </button>
      </div>

    </div>
  );
}