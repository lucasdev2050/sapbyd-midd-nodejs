const { Router } = require("express");
const { filterFileContent } = require("../services/uploadFile.js");
const path = require("path");

const fileRoutes = Router();

//Post Method
fileRoutes.post('/', filterFileContent)

//Get all Method
fileRoutes.get('/download', async (req, res) => {
    const file = path.join("/tmp", "nuevoArchivo.txt");
    res.download(file);
})

module.exports = {fileRoutes}