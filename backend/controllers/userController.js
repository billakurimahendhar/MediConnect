import validator from 'validator';
import bycrypt from 'bcryptjs';
import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
const registerUser = async (req, res) => {
  
  try{
    const { name, email, password} = req.body;

    if(!name || !email || !password){
      return res.status(400).json({success:false, message: 'All fields are required' });
    }
    if(!validator.isEmail(email)){
      return res.status(400).json({success:false, message: 'Invalid email format' });
    }
    if(password.length < 8 ) {
      return res.status(400).json({success:false,message: 'Password must be at least 6 characters long' });
    }
    const salt = await bycrypt.genSalt(10);
    const hashedPassword = await bycrypt.hash(password, salt);
    const userData={ name, email, password: hashedPassword };
    const newUser= new userModel(userData);
    const user=await newUser.save();
    const token = jwt.sign( {id:user._id}, process.env.JWT_SECRET );
    res.status(201).json({success:true, message: 'User registered successfully', token });

  }catch(error){
    res.status(500).json({success:false, message: 'Server error' });
  }
}
const loginUser = async (req, res) => {
  try{
    const { email, password} = req.body;    
    if(!email || !password){
      return res.status(400).json({success:false, message: 'All fields are required' });
    }   
    const user= await userModel.findOne({email});
    if(user.length === 0){
      return res.status(400).json({success:false, message: 'Invalid email or password' });
    }   
    const isMatch = await bycrypt.compare(password, user.password);
    if(isMatch){
      
        const token = jwt.sign( {id:user._id}, process.env.JWT_SECRET );
        res.json({success:true, message: 'User logged in successfully', token });
    }
    else{
      return res.status(400).json({success:false, message: 'Invalid email or password' });
    }   

  }catch(error){
    res.status(500).json({success:false, message: 'Server error' });
  }
};

export { registerUser , loginUser};