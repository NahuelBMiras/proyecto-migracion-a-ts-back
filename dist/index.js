"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorMiddleware_1 = __importDefault(require("./middleware/errorMiddleware"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const recyclingRoutes_1 = __importDefault(require("./routes/recyclingRoutes"));
//import couponRoutes  from './routes/couponRoutes';
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const chatbotRoutes_1 = __importDefault(require("./routes/chatbotRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, cors_1.default)({
    origin: '*',
    methods: 'GET, POST, PUT, DELETE'
}));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
//endpoint de reciclaje confirmacion 
app.use('/api', recyclingRoutes_1.default);
// endpoints auth
app.use('/api/auth', authRoutes_1.default);
// endpoints coupon 
//app.use('/api/coupons', couponRoutes)
//endpoint admin
app.use('/api/admin', adminRoutes_1.default);
//endpoint chatbot
app.use('/api/chatbot', chatbotRoutes_1.default);
// endpoints usersPoints
app.use('/api/users', userRoutes_1.default);
app.use(errorMiddleware_1.default);
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
