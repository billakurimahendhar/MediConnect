import React, { useContext, useEffect } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const Dashboard = () => {
  const { aToken, getDashData, cancelAppointment, dashData } =
    useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getDashData();
    }
  }, [aToken]);

  return (
    dashData && (
      <div className="m-6 space-y-10">
        {/* ====== Top Stats ====== */}
        <div className="grid sm:grid-cols-3 gap-6">
          {/* Doctors Card */}
          <div className="flex items-center gap-6 bg-gradient-to-br from-indigo-50 to-white p-6 rounded-2xl border border-gray-100 shadow-md cursor-pointer hover:scale-105 transition-all">
            <img className="w-16" src={assets.doctor_icon} alt="Doctors" />
            <div>
              <p className="text-3xl font-bold text-indigo-600 leading-snug">
                {dashData.doctors}
              </p>
              <p className="text-gray-500 text-lg">Doctors</p>
            </div>
          </div>

          {/* Appointments Card */}
          <div className="flex items-center gap-6 bg-gradient-to-br from-purple-50 to-white p-6 rounded-2xl border border-gray-100 shadow-md cursor-pointer hover:scale-105 transition-all">
            <img
              className="w-16"
              src={assets.appointments_icon}
              alt="Appointments"
            />
            <div>
              <p className="text-3xl font-bold text-purple-600 leading-snug">
                {dashData.appointments}
              </p>
              <p className="text-gray-500 text-lg">Appointments</p>
            </div>
          </div>

          {/* Patients Card */}
          <div className="flex items-center gap-6 bg-gradient-to-br from-pink-50 to-white p-6 rounded-2xl border border-gray-100 shadow-md cursor-pointer hover:scale-105 transition-all">
            <img className="w-16" src={assets.patients_icon} alt="Patients" />
            <div>
              <p className="text-3xl font-bold text-pink-600 leading-snug">
                {dashData.patients}
              </p>
              <p className="text-gray-500 text-lg">Patients</p>
            </div>
          </div>
        </div>

        {/* ====== Latest Bookings ====== */}
        <div className="bg-white rounded-2xl shadow-md border overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <img src={assets.list_icon} className="w-6" alt="list" />
            <p className="font-semibold text-lg">Latest Bookings</p>
          </div>

          {/* List */}
          <div className="divide-y">
            {dashData.latestAppointments.slice(0, 5).map((item, index) => (
              <div
                className="flex items-center px-6 py-4 gap-4 hover:bg-indigo-50 transition-all"
                key={index}
              >
                {/* Doctor Image */}
                <img
                  className="rounded-full w-12 h-12 border shadow-sm ring-2 ring-indigo-100"
                  src={item.docData.image}
                  alt="doctor"
                />

                {/* Doctor Info */}
                <div className="flex-1 text-sm">
                  <p className="text-gray-800 font-semibold text-base">
                    {item.docData.name}
                  </p>
                  <p className="text-gray-500 text-sm">
                    Booking on{" "}
                    <span className="text-indigo-600 font-medium">
                      {slotDateFormat(item.slotDate)}
                    </span>
                  </p>
                </div>

                {/* Status / Action */}
                <div className="flex justify-center min-w-[100px]">
                  {item.cancelled ? (
                    <span className="text-red-600 text-xs font-semibold bg-red-100 px-3 py-1 rounded-full shadow-sm">
                      Cancelled
                    </span>
                  ) : item.isCompleted ? (
                    <span className="text-green-600 text-xs font-semibold bg-green-100 px-3 py-1 rounded-full shadow-sm">
                      Completed
                    </span>
                  ) : (
                    <img
                      onClick={() => cancelAppointment(item._id)}
                      className="w-8 cursor-pointer hover:scale-110 transition-transform"
                      src={assets.cancel_icon}
                      alt="cancel"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;
