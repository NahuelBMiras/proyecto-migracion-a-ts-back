import express from 'express'
import cors from 'cors';
import dotenv from 'dotenv';
import errorMiddleware  from './middleware/errorMiddleware';
import  authRoutes  from './routes/authRoutes';
import recyclingRoutes from './routes/recyclingRoutes';
import { confirmRecycling } from './controllers/recyclingController';
//import couponRoutes  from './routes/couponRoutes';
import adminRoutes from './routes/adminRoutes';
import chatbotRoutes from './routes/chatbotRoutes';
import userRoutes from './routes/userRoutes';


dotenv.config()
const app = express();

app.use(cors())


app.use(cors({
    origin: '*',
    methods: 'GET, POST, PUT, DELETE'
}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//endpoint de reciclaje confirmacion 
app.use('/api', recyclingRoutes)

// endpoints auth
app.use('/api/auth', authRoutes)

// endpoints coupon 
//app.use('/api/coupons', couponRoutes)

//endpoint admin
app.use('/api/admin', adminRoutes);

//endpoint chatbot
app.use('/api/chatbot', chatbotRoutes);


// endpoints usersPoints
app.use('/api/users', userRoutes)


app.use(errorMiddleware)

const PORT = process.env.PORT || 3002;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

