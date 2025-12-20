import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import store from '../src/store/store.ts'
import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'



// Import Pages
import RegisterPage from './components/pages/RegisterPage.tsx'
import LoginPage from './components/pages/LoginPage.tsx'
import HomePage from './components/pages/DashboardPage.tsx'
import DashboardPage from './components/pages/HomePage.tsx'
import TestPage from './components/pages/TestPage.tsx'
import ProfilePage from './components/pages/ProfilePage.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient} >
      <Provider store={store} >
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<App/>} >
              <Route path='/' element={<HomePage />}/>
              <Route path='/dashboard' element={<DashboardPage />}/>
              <Route path='/profile/:id' element={<ProfilePage />}/> 
            </Route>
            <Route path='/test' element={<TestPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/login' element={<LoginPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </QueryClientProvider>
  </StrictMode>,
)
