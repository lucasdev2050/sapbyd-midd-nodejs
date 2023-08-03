import "dotenv/config";
import cors from "cors";
import express from "express";
import fileRoutes from "./routes/filesRouter.js";
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import path from 'path';

const app = express();
app.use(cors())
app.use(express.json());
const port = process.env.PORT || 8080;

// Path
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// View Engine Setup
app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs")



app.get("/",function(req,res){
    res.render("index");
})

app.use('/api', fileRoutes)

app.listen(port, () => {
    console.log(`Server Started at ${port}`)
})