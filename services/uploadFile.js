const fs = require("fs/promises");
const fetch = require("node-fetch");
const path = require("path");
const git = require("nodegit");

const repoURL = "https://github.com/lucasdev2050/sapbyd-midd-nodejs";
const repoPath = path.join("/tmp", "temp-repo"); // Ruta temporal para clonar el repositorio
const filePath = path.join(repoPath, "./uploads/Padron-CABA.txt");

async function cloneRepoAndReadFile() {
  try {
    // Clonar el repositorio
    await git.Clone(repoURL, repoPath);

  } catch (error) {
    console.error("Error:", error);
  }
}

cloneRepoAndReadFile();

const filePathValues = path.join("/tmp", "filteredTaxID.txt");
// const filePath = "./uploads/Padron-CABA.txt";
const nuevoArchivo = path.join("/tmp", "nuevoArchivo.txt");
// const padronCabaJson = "./uploads/padron-caba.json";

async function fetchDataFromByD() {
  const auth = "Basic " + Buffer.from(process.env.BYDUSERNAME + ":" + process.env.BYDPASSWORD).toString("base64");
  const headers = {
    Authorization: auth,
    "x-csrf-token": "fetch",
    "Accept-Encoding": "gzip, deflate, br",
  };

  const response = await fetch(process.env.ODATAURI, { headers });
  const data = await response.json();
  return data.d.results;
}

async function writeFilteredTaxIDs(data) {
  const filteredTaxIDs = data
    .filter((obj) => obj.CountryCode === "AR")
    .map((obj) => obj.PartyTaxID)
    .join("\n");
  
  await fs.writeFile(filePathValues, filteredTaxIDs, "utf-8");
}

async function filterFileContent() {
  const dataJson = await fetchDataFromByD();
  await writeFilteredTaxIDs(dataJson);

  try {
    const dataArray = (await fs.readFile(filePathValues, "utf-8")).split("\n").map((line) => line.trim());
    console.log("dataArray:" + dataArray)
    const fileContent = await fs.readFile(filePath, "utf-8");
    const lines = fileContent.split("\n");

    console.log("fileContent:" + fileContent)

    const filteredLines = lines.filter((line) => dataArray.some((value) => line.includes(value)));

    console.log("filteredLines:" + filteredLines)

    const result = filteredLines.join("\n");
    await fs.writeFile(nuevoArchivo, result, "utf-8");

    console.log("result:" + result);
    
    console.log("El archivo ha sido filtrado exitosamente.");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

module.exports = { filterFileContent }