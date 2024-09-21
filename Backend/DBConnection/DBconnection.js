// import mongoose from "mongoose";
// import dotenv from "dotenv"
// dotenv.config()

// const connectDB = async () => {
//     try {
//         const conn = await mongoose.connect(process.env.MONGO_URI);
//         console.log(`MongoDB Connected: ${conn.connection.host}`);
//     } catch (error) {
//         console.error(`Error: ${error.message}`);
//         process.exit(1); // Exit process with failure
//     }
// };

// export default connectDB

import {MongoClient, ServerApiVersion} from "mongodb"

const uri = "mongodb+srv://mosimkhan15102001:gXbxNu8lIpr6czQQ@kabutar-cluster.utvb1.mongodb.net/?retryWrites=true&w=majority&appName=kabutar-cluster&tls=true";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: {
      version: ServerApiVersion.v1,
      strict: false,  // Set strict to false
      deprecationErrors: true,
    },
    tlsAllowInvalidCertificates: true,  // This disables SSL validation
  });
  

async function connectDB() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
}
connectDB().catch(console.dir);

export default connectDB
