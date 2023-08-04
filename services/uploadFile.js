
const fetch = require("node-fetch");
const config = require("../config/config.js")

const fs = require("@cyclic.sh/s3fs/promises")(process.env.S3_BUCKET_NAME, config);

const filePathValues = `${process.cwd()}/uploads/filteredTaxID.txt`;
const filePath = `${process.cwd()}/uploads/Padron-CABA.txt`;
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
  
  await fs.writeFile(filePathValues, JSON.stringify(filteredTaxIDs));
}

async function filterFileContent() {
  const dataJson = await fetchDataFromByD();
  await writeFilteredTaxIDs(dataJson);

  try {
    const dataArray = (await JSON.parse(fs.readFile(filePathValues)).split("\n").map((line) => line.trim()));
    const fileContent = await JSON.parse(fs.readFile(filePath));
    // await fs.writeFile("./uploads/padron-caba.json", fileContent, "utf-8");
    const lines = fileContent.split("\n");

    const filteredLines = lines.filter((line) => dataArray.some((value) => line.includes(value)));

    const result = filteredLines.join("\n");
    await fs.writeFile(`${process.cwd()}/uploads/nuevoArchivo.txt`, JSON.stringify(result));
    
    console.log("El archivo ha sido filtrado exitosamente.");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

module.exports = { filterFileContent }