import app from "@/src/app";
import configs from "@/src/config";
import { connectMongoDB } from "@/src/database/db";


// for eexternals resources


async function  run() {
  try{
    await connectMongoDB();
    app.listen(configs.port, () => {
      console.log(`User Service running on Port: ${configs.port}`);
    });
  }catch (err) {
    console.error("Error starting the server:", err);
    process.exit(1); // Exit the process with a non-zero status code
  };
}

run();
