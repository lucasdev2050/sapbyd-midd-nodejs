import multer from "multer";

// var upload = multer({ dest: "Upload_folder_name" })
// If you do not want to use diskStorage then uncomment it
    
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
  
        // Uploads is the Upload_folder_name
        cb(null, "uploads")
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + ".txt")
    }
  })
       
// Define the maximum size for uploading
// picture i.e. 1 MB. it is optional
const maxSize = 1 * 1000 * 1000;

const fileFilter = (req, file, cb) => {
    if (file.mimetype == 'text/plain') { // checking the MIME type of the uploaded file
        cb(null, true);
    } else {
        cb(null, false);
    }
}
    
export const uploadFile = multer({
    fileFilter,
    storage
}).single("cuits");