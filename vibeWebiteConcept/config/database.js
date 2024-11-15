import mongoose from 'mongoose';

   const connectDB = async () => {
       const dbUri = process.env.CONNECTION_STRING;
       
       if (!dbUri) {
           console.error('DB_CONNECTION_STRING is not defined in the environment');
           process.exit(1);
       }

       try {
           await mongoose.connect(dbUri, {
               useNewUrlParser: true,
               useUnifiedTopology: true,
           });
           console.log('MongoDB connected successfully');
       } catch (error) {
           console.error('MongoDB connection error:', error);
           process.exit(1);
       }
   };

   export default connectDB;
// mongodb://localhost:27017/vibe