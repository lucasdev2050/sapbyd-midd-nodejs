const fetch = require("node-fetch");
const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const filePathValues = "filteredTaxID.txt";
const filePath = "./uploads/Padron-CABA.txt";

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

  const params = {
    Bucket: process.env.CYCLIC_BUCKET_NAME,
    Key: filePathValues,
    Body: filteredTaxIDs,
    ContentType: "text/plain",
  };

  await s3.upload(params).promise();
}

async function filterFileContent() {
  const dataJson = await fetchDataFromByD();
  await writeFilteredTaxIDs(dataJson);

  try {
    const dataArray = (
      await s3.getObject({ Bucket: process.env.CYCLIC_BUCKET_NAME, Key: filePathValues }).promise()
    ).Body.toString("utf-8").split("\n").map((line) => line.trim());

    // const fileContent = (
    //   await s3.getObject({ Bucket: process.env.S3_BUCKET_NAME, Key: filePath }).promise()
    // ).Body.toString("utf-8");

    const fileContent = await fs.readFile(filePath, "utf-8");

    const lines = fileContent.split("\n");

    const filteredLines = lines.filter((line) =>
      dataArray.some((value) => line.includes(value))
    );

    const result = filteredLines.join("\n");

    const resultParams = {
      Bucket: process.env.CYCLIC_BUCKET_NAME,
      Key: "nuevoArchivo.txt",
      Body: result,
      ContentType: "text/plain",
    };

    await s3.upload(resultParams).promise();

    console.log("El archivo ha sido filtrado exitosamente.");
  } catch (error) {
    console.error("Error:", error.message);
  }
}

module.exports = { filterFileContent };