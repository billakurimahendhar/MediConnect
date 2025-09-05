import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";

import { v2 as cloudinary } from 'cloudinary'




// API to register user
const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        // checking for all data to register user
        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword,
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to login user
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user profile data
const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId;             // <-- changed
    const userData = await userModel.findById(userId).select("-password");
    res.json({ success: true, userData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


// API to update user profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;             // <-- changed
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });

    if (imageFile) {
      const upload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
      await userModel.findByIdAndUpdate(userId, { image: upload.secure_url });
    }

    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};




// controllers/appointmentController.js (or wherever bookAppointment lives)
const bookAppointment = async (req, res) => {
  try {
    // read userId from req.user (set by authUser middleware). fallback to req.body.userId if present.
    const userId = req.user?.userId || req.body?.userId;
    const { docId, slotDate, slotTime } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!docId || !slotDate || !slotTime) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    // get doctor as plain object
    const docData = await doctorModel.findById(docId).lean();
    if (!docData) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }

    if (!docData.available) {
      return res.json({ success: false, message: "Doctor Not Available" });
    }

    // ensure slots_booked is an object
    const slots_booked = docData.slots_booked || {};

    // check/mark slot
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot Not Available" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [slotTime];
    }

    // get user data for embedding in appointment
    const userData = await userModel.findById(userId).select("-password").lean();
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // make a copy of docData without slots_booked so we don't store booking state inside appointment's docData
    const { slots_booked: _ignore, ...docDataForAppointment } = docData;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData: docDataForAppointment,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };
console.log("Appointment Data:", appointmentData);
    // save appointment
    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    // update doctor's slots_booked in DB
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    return res.json({ success: true, message: "Appointment Booked" });
  } catch (error) {
    console.error("bookAppointment error:", error);
    return res.json({ success: false, message: error.message });
  }
};

const listAppointment = async (req, res) => {
  try {
    // use either req.user or req.body
    const userId = req.user?.userId || req.body?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const appointments = await appointmentModel.find({ userId }).lean();

    console.log("Listing appointments for userId:", userId);
    console.log("Fetched appointments:", appointments);

    res.json({ success: true, appointments });
  } catch (error) {
    console.error("listAppointments error:", error);
    res.json({ success: false, message: error.message });
  }
};
const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const userId = req.user.userId; // take userId from auth middleware

        const appointmentData = await appointmentModel.findById(appointmentId);

        // verify appointment user 
        if (appointmentData.userId.toString() !== userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized action' });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });

        // releasing doctor slot 
        const { docId, slotDate, slotTime } = appointmentData;
        const doctorData = await doctorModel.findById(docId);
        let slots_booked = doctorData.slots_booked;

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime);
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });

        res.json({ success: true, message: 'Appointment Cancelled' });

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
};







export {
    loginUser,
    registerUser,
    getProfile,
    updateProfile,bookAppointment,listAppointment,cancelAppointment}
    