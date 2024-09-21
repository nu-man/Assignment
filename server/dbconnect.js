
import mongoose from "mongoose";
 async function connectDB(){
    try {
        await mongoose.connect("mongodb+srv://Bizmonk:testdb@register.rf8sf.mongodb.net/?retryWrites=true&w=majority&appName=register"
)
        console.log("Connected to mongoDB");
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
 }


 export default connectDB