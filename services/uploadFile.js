const fs = require("fs/promises");
const fetch = require("node-fetch");
const path = require("path");

const filePath = "./uploads/Padron-CABA_1.txt";
const filePath2 = "./uploads/Padron-CABA_2.txt";

const filePathValues = path.join("/tmp", "filteredTaxID.txt");
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
    const fileContent = await fs.readFile(filePath, "utf-8");
    const fileContent2 = await fs.readFile(filePath2, "utf-8");

    const lines = fileContent.split("\n");
    const lines2 = fileContent2.split("\n");

    const mergedArray = [...lines, ...lines2];

    console.log("Antes de filtrar");

    const filteredLines = mergedArray.filter((line) => dataArray.some((value) => line.includes(value)));

    console.log("llegue hasta aqui");

    const result = filteredLines.join("\n");
    await fs.writeFile(nuevoArchivo, result, "utf-8");

    console.log("result:" + result);
    
    console.log("El archivo ha sido filtrado exitosamente.");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

module.exports = { filterFileContent }



// const fs = require("fs/promises");
// const fetch = require("node-fetch");


// // const fs = require("@cyclic.sh/s3fs/promises")(process.env.S3_BUCKET_NAME, config);

// const filePathValues = "./uploads/filteredTaxID.txt";
// const filePath = "./uploads/Padron-CABA_1.txt";
// const filePath2 = "./uploads/Padron-CABA_2.txt";
// // const padronCabaJson = "./uploads/padron-caba.json";

// async function fetchDataFromByD() {
//   const auth = "Basic " + Buffer.from(process.env.BYDUSERNAME + ":" + process.env.BYDPASSWORD).toString("base64");
//   const headers = {
//     Authorization: auth,
//     "x-csrf-token": "fetch",
//     "Accept-Encoding": "gzip, deflate, br",
//   };

//   const response = await fetch(process.env.ODATAURI, { headers });
//   const data = await response.json();
//   return data.d.results;
// }

// async function writeFilteredTaxIDs(data) {
//   const filteredTaxIDs = data
//     .filter((obj) => obj.CountryCode === "AR")
//     .map((obj) => obj.PartyTaxID)
//     .join("\n");
  
//   await fs.writeFile(filePathValues, filteredTaxIDs, "utf-8");
// }

// async function filterFileContent() {
//   const dataJson = await fetchDataFromByD();
//   await writeFilteredTaxIDs(dataJson);

//   try {
//     const dataArray = (await fs.readFile(filePathValues, "utf-8")).split("\n").map((line) => line.trim());
//     const fileContent = await fs.readFile(filePath, "utf-8");
//     const fileContent2 = await fs.readFile(filePath2, "utf-8");
   
//     const lines = fileContent.split("\n");
//     const lines2 = fileContent2.split("\n");

//     const mergedArray = [...lines, ...lines2];

//     const filteredLines = mergedArray.filter((line) => dataArray.some((value) => line.includes(value)));

//     const result = filteredLines.join("\n");
//     await fs.writeFile("./uploads/nuevoArchivo.txt", result, "utf-8");
    
//     console.log("El archivo ha sido filtrado exitosamente.");
//   } catch (error) {
//     console.error("Error:", error.message);
//   }
// }

// module.exports = { filterFileContent }