import { Outlet } from 'react-router-dom'
import './App.css'
import Header from './components/Header'
import Footer from './components/Footer'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <>
      <div className="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-800 via-black to-black text-gray-100">
        
        <Header />

        <main className="flex-grow pt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>

        <Footer />
        <Toaster />
      </div>
    </>
  )
}

export default App
