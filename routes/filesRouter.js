const { Router } = require("express");
const { filterFileContent } = require("../services/uploadFile.js");

const fileRoutes = Router();

//Post Method
fileRoutes.post('/', async (req, res, next) => {
    console.log("Status: In Process..")
    await filterFileContent().then(() => res.redirect('http://localhost:3000/'))
})

//Get all Method
fileRoutes.get('/download', async (req, res) => {
    const file = `./uploads/nuevoArchivo.txt`;
    res.download(file);
})

module.exports = {fileRoutes}