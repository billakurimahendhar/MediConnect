import { createContext } from "react";
import axios from "axios";
import {toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";
import { useEffect } from "react";
export const AppContext = createContext();
const AppContextProvider = (props)=>{
    const currencySymbol = "$";
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [doctors,setDoctors]=useState([]);
    const [token,setToken]=useState('');
   
    const getDoctors=async()=>{
        try{
            console.log(backendUrl);
            const {data}=await axios.get(backendUrl+'/api/doctor/list')  ;
            console.log(data);
            if(data.success){
                setDoctors(data.doctors);
            }
            else{
                toast.error(data.message);
            }
        }catch(error){
            console.log(error)
            toast.error(error.message);
        }     
      }
        const value={
        doctors,
        currencySymbol,
        token,
        setToken,
        backendUrl
    }
        useEffect(()=>{
            getDoctors();
        },[]);
    return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
}
export default AppContextProvider;