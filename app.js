import dbSetUp from "./db/dbSetUp.js";
import * as dotenv from "dotenv";
import * as fs from "fs";
import csvParser from "csv-parser";
import {
  fetchDataForAlgorithmLinks,
  saveDataToDatabase,
} from "./data-crawled/collectProblems.js";

dotenv.config();

const SERVER_PORT = process.env.SERVER_PORT;

// DB ENV
const DB_HOST = process.env.DB_HOST;
const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_COLLECTION = process.env.DB_COLLECTION;

dbSetUp(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_COLLECTION);

const csvFilePath = "./files/csv/Algorithm_list.csv";
let algorithmLinks = [];
let resultData = [];

fs.createReadStream(csvFilePath)
  .pipe(csvParser())
  .on("data", (row) => {
    algorithmLinks.push(row["Problem_link"]);
  })
  .on("end", async () => {
    resultData = await fetchDataForAlgorithmLinks(algorithmLinks);

    const outputFile = "./files/output/resultData.json";
    fs.writeFile(outputFile, JSON.stringify(resultData, null, 2), (err) => {
      if (err) {
        console.error("Error writing file:", err);
      } else {
        console.log("resultData has been saved to", outputFile);
      }
    });

    await saveDataToDatabase(resultData);
  });
