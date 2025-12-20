import Loader from './Loader'
import { useForm } from '../../node_modules/react-hook-form/dist'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getAllUserNames, updateTask } from '../api/user.api'
import { createTask } from '../api/user.api'
import type { SubmitHandler } from "../../node_modules/react-hook-form/dist";

type AddTaskProps = {
  existingtask?: Inputs | null;
  setDisplayAddTaskForm: React.Dispatch<React.SetStateAction<boolean>>;
};

type Inputs = {
    _id?: string,
    title: string,
    description: string,
    dueDate: string,
    priority: string,
    status: string,
    assignedToId: string
}


function AddTask({existingtask=null, setDisplayAddTaskForm}: AddTaskProps) {
    const queryClient = useQueryClient()

    const alluserNamesQuery = useQuery({
        queryKey: ['All users name'],
        queryFn: getAllUserNames
    })

    const createTaskMutation:any = useMutation({   
        mutationKey: ['Create Task'],
        mutationFn: createTask,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['AllTasks'],
                exact: true
            })
        }
    })

    const updateTaskMutation:any = useMutation({
        mutationKey: ['Update Task'],
        mutationFn: updateTask,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['AllTasks'],
                exact: true
            })
        }
    })

    if(createTaskMutation.isSuccess || updateTaskMutation.isSuccess){
        setDisplayAddTaskForm(false)
    }

    const { handleSubmit, register, formState: {isValid} } = useForm<Inputs>(
        {
            mode:"onChange",
            defaultValues: {
                _id: existingtask?._id || "",
                title: existingtask?.title || "",
                description: existingtask?.description || "",
                dueDate: existingtask?.dueDate || "",
                priority: existingtask?.priority || "",
                status: existingtask?.status || "",
                assignedToId: existingtask?.assignedToId || ""
            }
        }
    )

    const onSubmit:SubmitHandler<Inputs> = async(data) => {
        if( existingtask ){
            updateTaskMutation.mutate({...data, _id:existingtask._id})
        }else{
            createTaskMutation.mutate(data)
        }
    }

    return (
        <div className="fixed top-0 left-0 flex justify-center items-center w-screen h-screen bg-black/90 backdrop-blur-xl z-30" >
            <div className=" w-full h-full overflow-y-scroll bg-transparent z-50 flex justify-center items-center" >
                <div className="w-full max-w-sm space-y-4 p-6 relative">
                    <div className=" mb-4">
                        <h2 className="text-2xl font-semibold text-white">Create Task</h2>
                    </div>


                    <form onSubmit={ handleSubmit( onSubmit ) } action="submit">

                        <div>
                        <label className=" text-sm font-medium text-gray-400 mb-1">Title</label>
                        <input 
                        {...register("title", {
                            required: true
                        })} 
                        type="text" 
                        className="input" 
                        placeholder="title" />
                        </div>

                        <div>
                        <label className=" text-sm font-medium text-gray-400 mb-1">Description</label>
                        <textarea 
                        {...register("description", {
                            required: true
                        })}
                        className="input h-48 " 
                        placeholder="description" />
                        </div>

                        <div>
                        <label className=" text-sm font-medium text-gray-400 mb-1">Due date</label>
                        <input 
                        {...register("dueDate", {
                            required: true
                        })} 
                        type="date" 
                        className="input [&::-webkit-calendar-picker-indicator]:invert" />
                        </div>

                        <div>
                        <label className=" text-sm font-medium text-gray-400 mb-1">Priority</label>
                        <select 
                        {...register("priority", {
                            required: true
                        })} 
                        className="input" >
                            <option className='bg-black' value="">Select Priority</option>
                            <option className='bg-black' value="Low">Low</option>
                            <option className='bg-black' value="Medium">Medium</option>
                            <option className='bg-black' value="High">High</option>
                            <option className='bg-black' value="Urgent">Urgent</option>
                        </select>
                        </div>

                        <div>
                        <label className=" text-sm font-medium text-gray-400 mb-1">Status</label>
                        <select 
                        {...register("status", {
                            required: true
                        })}
                        className="input"  >
                            <option className='bg-black' value="">Select Status</option>
                            <option className='bg-black' value="To Do">To Do</option>
                            <option className='bg-black' value="In Progress">In Progress</option>
                            <option className='bg-black' value="Review">Review</option>
                            <option className='bg-black' value="Completed">Completed</option>
                        </select>
                        </div>

                        <div>
                        <label className=" text-sm font-medium text-gray-400 mb-1">Assign Task</label>
                        <select 
                        {...register("assignedToId", {
                            required: true
                        })}  
                        className="input" >
                            <option className='bg-black' value="">Select User</option>
                            {
                                alluserNamesQuery.isSuccess && alluserNamesQuery.data?.data.map( (user:any) => (
                                    <option key={user._id} className='bg-black' value={user._id}>{user.fullname}</option>
                                ) )
                            }
                        </select>
                        </div>
                    
                        <div className="flex justify-start items-center gap-3 pt-4">
                            <button 
                            type='submit'
                            disabled={!isValid}
                            className="btn btn-primary w-1/2">{existingtask? 'Update' : 'Create' }</button>
                            {createTaskMutation.isPending && <Loader />}
                        </div>
                    </form>

                    { createTaskMutation.isError && <span className='w-full absolute text-sm font-light text-red-500' >{createTaskMutation.error?.response?.data?.message}</span>}
                    { updateTaskMutation.isError && <span className='w-full absolute text-sm font-light text-red-500' >{updateTaskMutation.error?.response?.data?.message}</span>}

                    </div>

                    <div className=" absolute top-5 right-10 flex justify-start items-center gap-3 pt-4">
                        <button 
                        onClick={() => setDisplayAddTaskForm(false)}
                        type='submit'
                        className="btn w-1/2">X</button>
                    </div>
                    
            </div>
        </div>
    )
}

export default AddTask