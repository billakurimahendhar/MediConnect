import react from 'react';
import Login from './pages/login.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';      
import { AdminContext } from './context/AdminContext.jsx';
import Navbar from './components/Navbar.jsx';
import { useContext } from 'react';
import Sidebar from './components/Sidebar.jsx';
import { Route, Routes } from "react-router-dom";

const App = () => {
  const {aToken}= useContext(AdminContext);
  return aToken? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer />
      <Navbar/>
      <div className='flex items-start'>
        <Sidebar />
        <Routes>
          <Route path='/' element={<></>} />
          <Route path='/admin-dashboard' element={<Dashboard />} />
          <Route path='/all-appointments' element={<AllAppointments />} />
          <Route path='/add-doctor' element={<AddDoctor />} />
          <Route path='/doctor-list' element={<DoctorsList />} />
          <Route path='/doctor-dashboard' element={<DoctorDashboard />} />
          <Route path='/doctor-appointments' element={<DoctorAppointments />} />
          <Route path='/doctor-profile' element={<DoctorProfile />} />
        </Routes>
      </div>
      
    </div>
  ):(
    <>
      <Login />
      <ToastContainer />
    </>
  )
}
export default App;