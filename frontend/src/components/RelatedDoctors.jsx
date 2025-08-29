import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const RelatedDoctors = ({ speciality, docId }) => {
  const navigate = useNavigate()
  const { doctors } = useContext(AppContext)

  const [relDoc, setRelDoc] = useState([])

  useEffect(() => {
    if (doctors.length > 0 && speciality) {
      const doctorsData = doctors.filter(
        (doc) => doc.speciality === speciality && doc._id !== docId
      )
      setRelDoc(doctorsData)
    }
  }, [doctors, speciality, docId])

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-[#262626] px-4">
      <h1 className="text-3xl font-semibold">Related Doctors</h1>
      <p className="sm:w-1/3 text-center text-sm text-gray-600">
        Simply browse through our extensive list of trusted doctors.
      </p>

      {/* Horizontal Doctor Cards */}
      <div className="w-full flex flex-wrap justify-center gap-6 pt-8">
        {relDoc.map((item, index) => (
          <div
            onClick={() => {
              navigate(`/appointment/${item._id}`)
              scrollTo(0, 0)
            }}
            key={index}
            className="flex flex-col items-center w-60 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md cursor-pointer overflow-hidden transition-all duration-300 bg-white hover:-translate-y-2"
          >
            {/* Doctor Image */}
            <div className="w-full h-40 flex items-center justify-center bg-[#EAEFFF]">
              <img
                className="h-32 w-32 object-cover rounded-full shadow-md"
                src={item.image}
                alt={item.name}
              />
            </div>

            {/* Doctor Info */}
            <div className="p-4 text-center space-y-1">
              <div
                className={`flex items-center justify-center gap-2 text-sm ${
                  item.available ? 'text-green-500' : 'text-gray-400'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    item.available ? 'bg-green-500' : 'bg-gray-400'
                  }`}
                ></span>
                <p>{item.available ? 'Available' : 'Not Available'}</p>
              </div>

              <p className="text-lg font-semibold text-gray-800">
                {item.name}
              </p>
              <p className="text-sm text-gray-600">{item.speciality}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RelatedDoctors
