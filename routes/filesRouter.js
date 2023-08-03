import { Router } from "express";
import { uploadFile } from "../controllers/filesController.js";
import { filterFileContent } from "../services/uploadFile.js";

const fileRoutes = Router();

//Post Method
fileRoutes.post('/', async (req, res, next) => {
    // Error MiddleWare for multer file upload, so if any
    // error occurs, the image would not be uploaded!
    uploadFile(req,res,function(err) {
  
        if(err) {
  
            // ERROR occurred (here it can be occurred due
            // to uploading image of size greater than
            // 1MB or uploading different file type)
            res.send(err)
        }
        else {
  
            // SUCCESS, image successfully uploaded
            console.log("Status: In Process..")
        }
    })
    await filterFileContent().then(() => res.redirect('http://localhost:3000/'))
})

//Get all Method
fileRoutes.get('/download', async (req, res) => {
    const file = `./uploads/nuevoArchivo.txt`;
    res.download(file);
})

export default fileRoutes;