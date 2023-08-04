require("dotenv").config();
const cors = require("cors");
const express = require("express");
const {fileRoutes} = require("./routes/filesRouter.js");
const fileupload = require('express-fileupload');
// const { fileURLToPath } from 'url'
// const { dirname } from 'path'
// const path from 'path';

const app = express();
app.use(cors())
app.use(express.json());
app.use(fileupload({
    useTempFiles: true,
    tempFileDir: "/tmp",
}))
const port = process.env.PORT || 8080;

// Path
// const __filename = fileURLToPath(import.meta.url)
// const __dirname = dirname(__filename)

// // View Engine Setup
// app.set("views",path.join(__dirname,"views"))
// app.set("view engine","ejs")



// app.get("/",function(req,res){
//     res.render("index");
// })

app.use('/api', fileRoutes)

app.listen(port, () => {
    console.log(`Server Started at ${port}`)
})