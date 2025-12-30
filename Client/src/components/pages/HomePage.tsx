import { useEffect, useState } from 'react';
import TaskItem from '../TaskItem';
import { useQuery } from '@tanstack/react-query';
import Loader from '../Loader';
import { getAllTask } from '../../api/user.api';


export default function Home() {
    const [taskTodisplay, setTaskToDisplay] = useState([])
    const [sortBy, setSortBy] = useState("")
    const [priority, setPriority] = useState("")
    const [status, setStatus] = useState("")
    const [searchBy, setSearchBy] = useState("")

    // const user:any = useAppSelector( state => state.auth.userData )
    // console.log("TASKS::", taskTodisplay);
    

    const priorityOrder:any = {
        Urgent: 1,
        High: 2,
        Medium: 3,
        Low: 4
    }

    const getAllTaskQuery = useQuery({
        queryKey: ['AllTasks'],
        queryFn: getAllTask
    })

    const psFunc = () => {
        if( getAllTaskQuery.isSuccess ){
            if( priority == "" && status == "" ){
                setTaskToDisplay(getAllTaskQuery.data.data) 
            }else{
                setTaskToDisplay( getAllTaskQuery.data.data.filter( (task:any) => {
                    if( priority =="" ){
                        return task.status == status
                    }else if( status == "" ){
                        return task.priority == priority
                    }
                    return task.status == status && task.priority == priority
                    } 
                ))
            }
            
        }
    }

    useEffect( () => {
        psFunc()
    }, [priority, status, getAllTaskQuery.isSuccess, getAllTaskQuery.data] )

    const sortByFunc = () => {
        if( sortBy == "" ){
            setTaskToDisplay(getAllTaskQuery?.data?.data)
        }else if( sortBy == "priority" ){
            setTaskToDisplay((prev) =>
                [...prev].sort( (a:any, b:any) => priorityOrder[b.priority] - priorityOrder[a.priority] )
            )
        }else if( sortBy == "date" ){
            setTaskToDisplay((prev) =>
                [...prev].sort( (a:any, b:any) => Date.parse(b.dueDate) - Date.parse(a.dueDate))
            )
        }
    } 

    useEffect( () => {
        sortByFunc()
    }, [sortBy] )

    useEffect( () => {
        if( searchBy == "" ){
            psFunc()
            sortByFunc()
        }else{
            setTaskToDisplay( getAllTaskQuery?.data?.data.filter( (task:any) => {
                return task.title.toLowerCase().includes(searchBy)
            } ) )
        }
    }, [searchBy] )


    return (
        <div className="min-h-screen w-full  text-gray-100 p-6 md:p-8">
            <div className="max-w-5xl mx-auto space-y-8">
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white tracking-tight">All Tasks</h1>
                        <p className="text-gray-400 mt-1">Real-time updates across the team.</p>
                    </div>
                    <input
                    placeholder='search...'
                    className='input'
                    value={searchBy}
                    onChange={ (e:any) => setSearchBy(e.target.value.toLowerCase()) }
                    type="text" />
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                
                <aside className="w-full lg:w-64 space-y-6 flex-shrink-0">

                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Filters</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-gray-500 mb-1.5 block">Priority</label>
                            <select onClick={(e:any) => setPriority(e.target.value)} className="input text-sm py-2 bg-black/90 backdrop-blur-3xl ">
                                <option value={""} >All Priorities</option>
                                <option value={"High"} >High</option>
                                <option value={"Medium"} >Medium</option>
                                <option value={"Low"} >Low</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 mb-1.5 block">Status</label>
                            <select onClick={(e:any) => setStatus(e.target.value)} className="input text-sm py-2  bg-black/90 backdrop-blur-3xl ">
                                <option value={""} >All Status</option>
                                <option value={"To Do"} >To Do</option>
                                <option value={"In Progress"} >In Progress</option>
                                <option value={"Review"} >Review</option>
                                <option value={"Completed"} >Completed</option>
                            </select>
                        </div>
                    </div>
                    </div>
                </aside>

                <main className="flex-1">
                    <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-medium text-white">
                        Tasks
                        <span className="ml-2 text-sm text-gray-500 font-normal">({ taskTodisplay?.length || '0'})</span>
                    </h2>
                    
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Sort by:</span>
                        <select onClick={(e:any) => setSortBy(e.target.value)} className="bg-transparent border-none text-sm text-gray-300 focus:ring-0 cursor-pointer hover:text-white font-medium">
                            <option value={""} className="bg-gray-900">None</option>
                            <option value={"priority"} className="bg-gray-900">Priority (Highest)</option>
                            <option value={"date"} className="bg-gray-900">Due Date (Earliest)</option>
                        </select>
                    </div>
                    </div>

                    <div className="space-y-1s">
                    {getAllTaskQuery.isPending? <div className='w-full flex justify-center items-center' >
                        <Loader />
                        </div> : 
                        <div className="space-y-3">
                            {taskTodisplay?.length?  [...taskTodisplay].reverse().map((task:any) => (
                            <TaskItem 
                                key={task._id} 
                                task={task as any}
                            />
                            )): "No Tasks"}
                        </div>
                    }
                    </div>

                </main>

                </div>
            </div>
        </div>
    );
}