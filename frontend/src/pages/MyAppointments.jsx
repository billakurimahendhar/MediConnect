import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const MyAppointments = () => {
  const { backendUrl, token,getDoctorsData } = useContext(AppContext);
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [payment, setPayment] = useState("");

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return (
      dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
    );
  };

  // Getting User Appointments Data Using API
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token },
      });
      setAppointments(data.appointments.reverse());
      console.log("Appointments response:", data);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Function to cancel appointment Using API
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        console.log(response);

        try {
          const { data } = await axios.post(
            backendUrl + "/api/user/verifyRazorpay",
            response,
            { headers: { token } }
          );
          if (data.success) {
            navigate("/my-appointments");
            getUserAppointments();
          }
        } catch (error) {
          console.log(error);
          toast.error(error.message);
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Function to make payment using razorpay
  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/payment-razorpay",
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        initPay(data.order);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  // Function to make payment using stripe
  const appointmentStripe = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/payment-stripe",
        { appointmentId },
        { headers: { token } }
      );
      if (data.success) {
        const { session_url } = data;
        window.location.replace(session_url);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

   return (
   <div className='mt-6 grid gap-6'>
  {appointments.map((item, index) => (
    <div 
      key={index} 
      className='p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100'
    >
      {/* Top Section - Doctor Info */}
      <div className='flex gap-6 items-center'>
        <img 
          className='w-28 h-28 object-cover rounded-xl border border-gray-200 bg-[#EAEFFF]' 
          src={item.docData.image} 
          alt={item.docData.name} 
        />
        <div className='flex-1'>
          <p className='text-xl font-semibold text-gray-800'>{item.docData.name}</p>
          <p className='text-sm text-blue-600 font-medium'>{item.docData.speciality}</p>
          <p className='text-sm text-gray-500 mt-1'>{item.docData.experience}+ years experience</p>
          <p className='text-sm text-gray-500'>Fees: ₹{item.docData.fees}</p>
          <p className='text-sm text-gray-500'>Education: {item.docData.education}</p>
        </div>
      </div>

      {/* Divider */}
      <hr className='my-4 border-gray-200' />

      {/* Appointment Details */}
      <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3'>
        <div>
          <p className='text-sm text-gray-500'>Date & Time</p>
          <p className='text-base font-medium text-gray-700'>
            {slotDateFormat(item.slotDate)} | {item.slotTime}
          </p>
        </div>
        <div>
          <p className='text-sm text-gray-500'>Location</p>
          <p className='text-base font-medium text-gray-700'>{item.docData.address.line1}, {item.docData.address.line2}</p>
        </div>
      </div>

      {/* Divider */}
      <hr className='my-4 border-gray-200' />

      {/* Actions */}
      <div className='flex flex-wrap gap-3 justify-end'>
        {!item.cancelled && !item.payment && !item.isCompleted && payment !== item._id && (
          <button 
            onClick={() => setPayment(item._id)} 
            className='px-5 py-2 rounded-xl border text-gray-600 hover:bg-blue-500 hover:text-white transition-all'
          >
            Pay Online
          </button>
        )}
        {!item.cancelled && !item.payment && !item.isCompleted && payment === item._id && (
          <>
            <button 
              onClick={() => appointmentStripe(item._id)} 
              className='px-5 py-2 rounded-xl border flex items-center justify-center bg-gray-50 hover:bg-gray-100'
            >
              <img className='h-5' src={assets.stripe_logo} alt="Stripe" />
            </button>
            <button 
              onClick={() => appointmentRazorpay(item._id)} 
              className='px-5 py-2 rounded-xl border flex items-center justify-center bg-gray-50 hover:bg-gray-100'
            >
              <img className='h-5' src={assets.razorpay_logo} alt="Razorpay" />
            </button>
          </>
        )}
        {!item.cancelled && item.payment && !item.isCompleted && (
          <span className='px-5 py-2 rounded-xl bg-green-100 text-green-700 font-medium'>Paid</span>
        )}
        {item.isCompleted && (
          <span className='px-5 py-2 rounded-xl bg-green-50 text-green-600 border border-green-200 font-medium'>Completed</span>
        )}
        {!item.cancelled && !item.isCompleted && (
          <button 
            onClick={() => cancelAppointment(item._id)} 
            className='px-5 py-2 rounded-xl border text-gray-600 hover:bg-red-600 hover:text-white transition-all'
          >
            Cancel
          </button>
        )}
        {item.cancelled && !item.isCompleted && (
          <span className='px-5 py-2 rounded-xl bg-red-50 text-red-600 border border-red-200 font-medium'>
            Appointment Cancelled
          </span>
        )}
      </div>
    </div>
  ))}
</div>

  )
};

export default MyAppointments;
