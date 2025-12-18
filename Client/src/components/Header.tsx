import { useState } from 'react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 w-full z-50 border-b border-white/10 bg-black/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <div className="flex-shrink-0 flex items-center gap-2 cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-white">
              T
            </div>
            <span className="font-bold text-xl tracking-tight text-white">
              TaskFlow
            </span>
          </div>

          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
              Dashboard
            </a>
            <a href="#" className="text-white px-3 py-2 text-sm font-medium border-b-2 border-blue-500">
              My Tasks
            </a>
            <a href="#" className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors">
              Team View
            </a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            
            {/* <button className="relative p-2 text-gray-400 hover:text-white transition-colors">
              <span className="sr-only">View notifications</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
              <span className="absolute top-2 right-2 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-black"></span>
            </button> */}

            <button className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition shadow-lg shadow-blue-500/20">
              + New Task
            </button>

            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-gray-700 to-gray-600 border border-white/10 cursor-pointer"></div>
          </div>

          <div className="flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-400 hover:text-white p-2"
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
              <button className="w-full text-center bg-blue-600 text-white px-4 py-3 rounded-lg font-medium">
                Create New Task
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}