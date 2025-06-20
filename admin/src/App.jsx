import './App.css'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from "react-hot-toast";

import SignUp from './components/Auth/SignUp'
import SignIn from './components/Auth/SignIn'
import ErrorPage from './ErrorPage';
import RootSignIn from './components/Auth/RootSignIn'

//* Super Admin Routes
import ProtectedRoute from './pages/SuperAdmin/ProtectedRoute'
import Layout from './pages/SuperAdmin/Layout'
import Dashboard from './pages/SuperAdmin/Dashboard'
import Credentials from './pages/SuperAdmin/Credentials/Credentials'
import Users from './pages/Users';
import Profile from './pages/ProfileSettings';
import Leads from './pages/SuperAdmin/Leads/Leads';
import Projects from './pages/SuperAdmin/Projects/Projects';
import ProjectDetails from './pages/SuperAdmin/Projects/ProjectDetails';
import Expense from './pages/SuperAdmin/Expense/Expense';
import Earnings from './pages/SuperAdmin/Earnings/Page';

//* Admin Routes
import AdminProtectedRoute from './pages/Admin/ProtectedRoute'
import AdminLayout from './pages/Admin/Layout'
import AdminDashboard from './pages/Admin/Dashboard'
import AdminCredentials from './pages/Admin/Credentials/Credentials';
import AdminLeads from './pages/Admin/Leads/Leads';
import AdminProjects from './pages/Admin/Projects/Projects'
import AdminProjectsDetails from './pages/Admin/Projects/ProjectDetails';

function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<SignIn />} />
        <Route path='/root' element={<RootSignIn />} />
        <Route path='*' element={<ErrorPage />} />
        <Route path='/register' element={<SignUp />} />

        <Route path="/root-erp" element={<ProtectedRoute Component={Layout} />}   >
          <Route path='overview' element={<Dashboard />} />
          <Route path='credentials' element={<Credentials />} />
          <Route path='users' element={<Users />} />
          <Route path='profile' element={<Profile />} />
          <Route path='leads' element={<Leads />} />
          <Route path='projects' element={<Projects />} />
          <Route path='projects/:id' element={<ProjectDetails />} />
          <Route path='expense' element={<Expense />} />
          <Route path='earnings' element={<Earnings />} />
        </Route>

        <Route path="/erp" element={<AdminProtectedRoute Component={AdminLayout} />}   >
          <Route path='overview' element={<AdminDashboard />} />
          <Route path='credentials' element={<AdminCredentials />} />
          <Route path='profile' element={<Profile />} />
          <Route path='leads' element={<AdminLeads />} />
          <Route path='projects' element={<AdminProjects />} />
          <Route path='projects/:id' element={<AdminProjectsDetails />} />
        </Route>

      </Routes>
      <Toaster position='bottom-right' />
    </>
  )
}

export default App
