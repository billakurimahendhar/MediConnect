import express from 'express';
import cors from 'cors';    
import 'dotenv/config';
import connectDB from './config/mongodb.js';   
import connectCloudinary from './config/cloudinary.js'; 
import adminRouter from './routes/adminRoute.js';

const app = express();
const port= process.env.PORT || 5000;
connectDB();
connectCloudinary();


app.use(cors());//frontend and backend communication
app.use(express.json());

app.use('/api/admin',adminRouter);
app.get('/', (req, res) => {
    res.send('API is running....');
});

app.listen(port, () => {
    console.log(`Server is running  on port ${port}`);
});
