import { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } =
    useContext(AdminContext);
  const { calculateAge, slotDateFormat, currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  return (
    <div className="w-full max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          All Appointments
        </h2>
        <img src={assets.calendar_icon} className="w-8 h-8" alt="calendar" />
      </div>

      {/* Table */}
      <div className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 rounded-2xl shadow-lg border overflow-hidden">
        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-[0.5fr_2fr_1fr_2fr_2fr_1fr_1fr] bg-gradient-to-r from-indigo-500 to-purple-500 py-4 px-6 text-sm font-semibold text-white sticky top-0 z-10 shadow-md">
          <p>#</p>
          <p>Patient</p>
          <p>Age</p>
          <p>Date & Time</p>
          <p>Doctor</p>
          <p>Fees</p>
          <p>Action</p>
        </div>

        {/* Table Body */}
        <div className="max-h-[70vh] overflow-y-auto">
          {appointments.length > 0 ? (
            appointments.map((item, index) => (
              <div
                key={index}
                className="flex flex-wrap justify-between sm:grid sm:grid-cols-[0.5fr_2fr_1fr_2fr_2fr_1fr_1fr] items-center py-4 px-6 border-b hover:bg-indigo-50 transition duration-200"
              >
                {/* Index */}
                <p className="max-sm:hidden text-gray-600">{index + 1}</p>

                {/* Patient */}
                <div className="flex items-center gap-3">
                  <img
                    src={item.userData.image}
                    className="w-9 h-9 rounded-full border shadow-sm ring-2 ring-indigo-200"
                    alt=""
                  />
                  <p className="font-medium text-gray-800">
                    {item.userData.name}
                  </p>
                </div>

                {/* Age */}
                <p className="max-sm:hidden text-gray-700">
                  {calculateAge(item.userData.dob)}
                </p>

                {/* Date & Time */}
                <p className="text-gray-700 font-medium">
                  {slotDateFormat(item.slotDate)},{" "}
                  <span className="text-indigo-500">{item.slotTime}</span>
                </p>

                {/* Doctor */}
                <div className="flex items-center gap-3">
                  <img
                    src={item.docData.image}
                    className="w-9 h-9 rounded-full border shadow-sm ring-2 ring-purple-200 bg-gray-100"
                    alt=""
                  />
                  <p className="font-medium text-gray-800">
                    {item.docData.name}
                  </p>
                </div>

                {/* Fees */}
                <p className="font-semibold text-purple-600">
                  {currency}
                  {item.amount}
                </p>

                {/* Action */}
               <div className="flex justify-center">
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
            ))
          ) : (
            <p className="text-center py-10 text-gray-500">
              No appointments found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllAppointments;
