import mongoose from 'mongoose';

export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://avisinghal:123108032@cluster0.xxu7h.mongodb.net/Food_Delivery_Website')
    .then(()=>console.log("DB connected"));
}