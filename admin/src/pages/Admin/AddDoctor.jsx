import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const AddDoctor = () => {
  const [docImg, setDocImg] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const { backendUrl } = useContext(AppContext);
  const { aToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    try {
      if (!docImg) {
        return toast.error("Image Not Selected");
      }

      const formData = new FormData();

      formData.append("image", docImg);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 })
      );

      const { data } = await axios.post(
        backendUrl + "/api/admin/add-doctor",
        formData,
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        setDocImg(false);
        setName("");
        setPassword("");
        setEmail("");
        setAddress1("");
        setAddress2("");
        setDegree("");
        setAbout("");
        setFees("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="m-6 w-full flex justify-center"
    >
      <div className="bg-gradient-to-br from-indigo-50 to-white px-10 py-10 border rounded-2xl shadow-lg w-full max-w-5xl max-h-[85vh] overflow-y-auto">
        {/* Title */}
        <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-10">
          Add Doctor
        </h2>

        {/* Upload */}
        <div className="flex items-center gap-6 mb-10 text-gray-600">
          <label htmlFor="doc-img" className="cursor-pointer">
            <img
              className="w-20 h-20 object-cover bg-gray-100 rounded-full shadow-md border-2 border-dashed border-indigo-300 hover:scale-105 transition"
              src={docImg ? URL.createObjectURL(docImg) : assets.upload_area}
              alt=""
            />
          </label>
          <input
            onChange={(e) => setDocImg(e.target.files[0])}
            type="file"
            id="doc-img"
            hidden
          />
          <p className="text-sm text-gray-500">
            Upload doctor <br /> profile picture
          </p>
        </div>

        {/* Form Grid */}
        <div className="flex flex-col lg:flex-row gap-12 text-gray-700">
          {/* Left Column */}
          <div className="w-full lg:flex-1 flex flex-col gap-6">
            <div>
              <label className="text-sm font-medium">Name</label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-indigo-400"
                type="text"
                placeholder="Enter name"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Email</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-indigo-400"
                type="email"
                placeholder="Enter email"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Password</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-indigo-400"
                type="password"
                placeholder="Set password"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Experience</label>
              <select
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-indigo-400"
              >
                <option>1 Year</option>
                <option>2 Years</option>
                <option>3 Years</option>
                <option>4 Years</option>
                <option>5 Years</option>
                <option>6 Years</option>
                <option>8 Years</option>
                <option>9 Years</option>
                <option>10 Years</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Fees</label>
              <input
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-indigo-400"
                type="number"
                placeholder="Enter fees"
                required
              />
            </div>
          </div>

          {/* Right Column */}
          <div className="w-full lg:flex-1 flex flex-col gap-6">
            <div>
              <label className="text-sm font-medium">Speciality</label>
              <select
                onChange={(e) => setSpeciality(e.target.value)}
                value={speciality}
                className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-indigo-400"
              >
                <option>General physician</option>
                <option>Gynecologist</option>
                <option>Dermatologist</option>
                <option>Pediatricians</option>
                <option>Neurologist</option>
                <option>Gastroenterologist</option>
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">Degree</label>
              <input
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-indigo-400"
                type="text"
                placeholder="Enter degree"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Address</label>
              <input
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                className="w-full border rounded-lg px-4 py-2 mt-1 focus:ring-2 focus:ring-indigo-400"
                type="text"
                placeholder="Address line 1"
                required
              />
              <input
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                className="w-full border rounded-lg px-4 py-2 mt-3 focus:ring-2 focus:ring-indigo-400"
                type="text"
                placeholder="Address line 2"
                required
              />
            </div>
          </div>
        </div>

        {/* About */}
        <div className="mt-10">
          <label className="text-sm font-medium">About Doctor</label>
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            className="w-full border rounded-lg px-4 py-3 mt-1 focus:ring-2 focus:ring-indigo-400"
            rows={5}
            placeholder="Write about doctor..."
          />
        </div>

        {/* Submit */}
        <div className="flex justify-end mt-10">
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-600 to-purple-600 px-12 py-3 text-white rounded-full shadow-md hover:scale-105 transition"
          >
            Add Doctor
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddDoctor;
