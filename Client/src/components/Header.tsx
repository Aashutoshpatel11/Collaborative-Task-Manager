import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import AddTask from './AddTask';
import { useMutation } from '@tanstack/react-query';
import { getCurrentUser } from '../api/user.api';
import { useDispatch } from 'react-redux';
import { login, logout } from '../store/authSlice';
import { useAppSelector } from '../store/hooks';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [tab, setTab] = useState("")
  const [displayAddTaskForm, setDisplayAddTaskForm] = useState(false)

  const user:any = useAppSelector(state => state.auth.userData)

  const disptach = useDispatch()
  const navigate = useNavigate()

  const getCurrentUserMutation = useMutation({
    mutationKey: ['Current User'],
    mutationFn: getCurrentUser
  })

  if( getCurrentUserMutation.isSuccess ){
    disptach( login(getCurrentUserMutation.data.data) )
  }
  if(getCurrentUserMutation.isError){
    disptach( logout() )
    navigate('/login')
  }

  useEffect( () => {
    getCurrentUserMutation.mutate()
  }, [] )

  return (
    <header className="fixed top-0 w-full z-20 border-b border-white/10 backdrop-blur-3xl">
      {displayAddTaskForm && <AddTask setDisplayAddTaskForm= {setDisplayAddTaskForm} />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            {/* <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-white">
              T
            </div> */}
            <span className="font-bold text-xl tracking-tight text-white">
              Task Manager
            </span>
          </div>

          <nav className="hidden md:flex space-x-8">
            <NavLink onClick={() => setTab('home')} to="/" className={`text-white px-3 py-2 text-sm font-medium border-b-2 ${ tab=='home' ? 'border-blue-500': 'border-none' }`}>
              All Tasks
            </NavLink>
            <NavLink onClick={() => setTab('dashboard')} to="/dashboard" className={`text-white px-3 py-2 text-sm font-medium border-b-2 ${ tab=='dashboard' ? 'border-blue-500': 'border-none' }`}>
              Dashboard
            </NavLink>
          </nav>

          <div className="hidden md:flex items-center space-x-4">

            <button onClick={() => setDisplayAddTaskForm(true)} className="btn btn-primary">
              + New Task
            </button>

            <button onClick={ () => { navigate(`/profile/${user?._id}`) } } className="bg-black p-3 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 24 24">
                <path d="M12 12c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5z"/>
                <path d="M12 14c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5z"/>
              </svg>
            </button>

          </div>

          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="btn btn-neutral"
            >
              <span className="sr-only">Open menu</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-xl border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-white bg-white/10">
              Dashboard
            </a>
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5">
              My Tasks
            </a>
            <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5">
              Team View
            </a>
            <div className="pt-4 pb-2 border-t border-white/10 mt-4">
              <button onClick={() => setDisplayAddTaskForm(true)}  className="btn btn-primary">
                Create New Task
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}