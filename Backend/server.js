import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js";
import connectToDb from "./src/config/database.js";



const PORT = process.env.PORT || 5000;


connectToDb();
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
