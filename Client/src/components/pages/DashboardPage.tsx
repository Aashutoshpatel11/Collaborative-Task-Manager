import { useEffect, useState } from 'react';
import TaskItem from '../TaskItem';
import { useQuery } from '@tanstack/react-query';
import { getAllTask } from '../../api/user.api';
import Loader from '../Loader';
import { useAppSelector } from '../../store/hooks';

export default function Home() {
  const [taskToDisplay, setTaskToDisplay] = useState([])

  const user:any = useAppSelector( state => state.auth.userData)
  
  const [viewFilter, setViewFilter] = useState<'assigned' | 'created'>('assigned');

  const {data, isSuccess, isPending} = useQuery({
    queryKey: ['AllTasks'],
    queryFn: getAllTask
  })

  useEffect( () => {
    if(isSuccess){
      if(viewFilter == "assigned"){
        setTaskToDisplay( data.data.filter( (task:any) => task.assignedToId._id == user._id ) )
      }else{
        setTaskToDisplay( data.data.filter( (task:any) => task.creatorId._id == user._id ) )
      }
    }
  }, [viewFilter, isSuccess] )

  return (
    <div className="min-h-screen w-full text-gray-100">
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        <div className='flex flex-col md:flex-row md:justify-between md:items-start py-3 min-w-full' >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
            <div className='flex flex-col justify-start md:justify-start' >
              <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
              <p className="text-gray-400 mt-1">Manage your tasks.</p>
            </div>
          </div>

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
        </div> 

        {isPending? <div className='w-full flex justify-center items-center' >
          <Loader />
        </div> : 
          <div className="space-y-3">
            {isSuccess && [...taskToDisplay]?.reverse().map((task:any) => (
              <TaskItem 
                key={task._id} 
                task={task as any}
              />
            ))}
          </div>
        }

        <div className="mt-8 text-center border-t border-white/10 pt-8">
          <p className="text-gray-500 text-sm mb-4">You've reached the end of the list.</p>
        </div>

      </div>
    </div>
  );
}