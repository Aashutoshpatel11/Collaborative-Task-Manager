import React, { useState } from 'react';
import TaskItem from '../TaskItem';
import { useQuery } from '@tanstack/react-query';
import Loader from '../Loader';
import { getAllTask } from '../../api/user.api';


export default function DashboardPage() {
    const [viewFilter, setViewFilter] = useState<'assigned' | 'created'>('assigned');
    const [taskTodisplay, setTaskToDisplay] = useState([])

    // const {data, isError, error, isSuccess, isPending} = useQuery({
    const getAllTaskQuery = useQuery({
        queryKey: ['AllTasks'],
        queryFn: getAllTask
    })



    return (
        <div className="min-h-screen w-full  text-gray-100 p-6 md:p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
                    <p className="text-gray-400 mt-1">Manage your tasks.</p>
                </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                
                <aside className="w-full lg:w-64 space-y-6 flex-shrink-0">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Views</h2>
                    <div className="space-y-1">
                        <button 
                        onClick={() => setViewFilter('assigned')}
                        className={`btn btn w-full ${viewFilter === 'assigned' ? 'btn-secondary': 'btn'}`}
                        >
                        Assigned to Me
                        </button>
                        <button 
                        onClick={() => setViewFilter('created')}
                        className={`mt-2 btn w-full ${viewFilter === 'created' ? 'btn-secondary': 'btn'}`}
                        >
                        Created by Me
                        </button>
                    </div>
                    </div>

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Filters</h2>
                    <div className="space-y-4">
                        <div>
                        <label className="text-xs text-gray-500 mb-1.5 block">Priority</label>
                        <select className="input text-sm py-2 bg-black/90 backdrop-blur-3xl ">
                            <option>All Priorities</option>
                            <option>High</option>
                            <option>Medium</option>
                            <option>Low</option>
                        </select>
                        </div>
                        <div>
                        <label className="text-xs text-gray-500 mb-1.5 block">Status</label>
                        <select className="input text-sm py-2  bg-black/90 backdrop-blur-3xl ">
                            <option>All Status</option>
                            <option>To Do</option>
                            <option>In Progress</option>
                            <option>Completed</option>
                        </select>
                        </div>
                    </div>
                    </div>
                </aside>

                <main className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-white">
                        {viewFilter === 'assigned' ? 'My Tasks' : 'Created Tasks'} 
                        <span className="ml-2 text-sm text-gray-500 font-normal">({getAllTaskQuery.data? getAllTaskQuery.data.data?.length : '0'})</span>
                    </h2>
                    
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Sort by:</span>
                        <select className="bg-transparent border-none text-sm text-gray-300 focus:ring-0 cursor-pointer hover:text-white font-medium">
                        <option className="bg-gray-900">Due Date (Earliest)</option>
                        <option className="bg-gray-900">Priority (Highest)</option>
                        </select>
                    </div>
                    </div>

                    <div className="space-y-1s">
                    {getAllTaskQuery.isPending? <div className='w-full flex justify-center items-center' >
                        <Loader />
                        </div> : 
                        <div className="space-y-3">
                            {getAllTaskQuery.isSuccess && getAllTaskQuery.data.data.map((task) => (
                            <TaskItem 
                                key={task.id} 
                                task={task as any}
                            />
                            ))}
                        </div>
                    }
                    </div>

                </main>

                </div>
            </div>
        </div>
    );
}