
import TaskItem from '../TaskItem';
import { useQuery } from '@tanstack/react-query';
import { getAllTask } from '../../api/user.api';
import Loader from '../Loader';

export default function Home() {

  const {data, isSuccess, isPending} = useQuery({
    queryKey: ['AllTasks'],
    queryFn: getAllTask
  })

  return (
    <div className="min-h-screen w-full text-gray-100">
      
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">All Tasks</h1>
            <p className="text-gray-400 mt-1">Real-time updates across the team.</p>
          </div>
        </div>

        {isPending? <div className='w-full flex justify-center items-center' >
          <Loader />
        </div> : 
          <div className="space-y-3">
            {isSuccess && [...data.data].reverse().map((task) => (
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