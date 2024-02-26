import * as cheerio from "cheerio";
import axios from "axios";
import ProblemModel from "../db/models/problemModel.js";

const fetchDataForAlgorithmLinks = async (algorithmLinks) => {
  const resultData = [];

  for (const algorithmLink of algorithmLinks) {
    const url = `${algorithmLink}`;

    console.log(algorithmLink);

    try {
      const response = await axios.get(url);
      const html = response.data;
      const $ = cheerio.load(html);

      // JSON 데이터 가져오기
      const jsonData = $('script[data-target="react-app.embeddedData"]').html();
      const parsedData = JSON.parse(jsonData);

      const boj = parsedData.payload.tree.readme.richText;
      const boj$ = cheerio.load(boj);
      const tbody = boj$("table tbody tr");

      for (let j = 0; j < tbody.length; j++) {
        const el = boj$(tbody[j]);

        const problem = el.find("td:eq(2)").text();
        const problemNum = parseInt(problem);
        const problemLink = el.find("td:eq(2) a").attr("href"); //문제 링크

        const apiUrl = "https://solved.ac/api/v3/problem/show";

        try {
          const response = await axios.get(apiUrl, {
            params: {
              problemId: problemNum,
            },
            headers: {
              Accept: "application/json",
            },
          });

          const algoName = response.data.titleKo;
          const level = response.data.level;
          const link = problemLink;
          const tagDatas = response.data.tags;
          const tags = tagDatas.map((tagData) => {
            const displayName = tagData.displayNames.find(
              (display) => display.language === "ko"
            );
            return displayName ? displayName.name : null;
          });

          const resultObj = {
            problemNum,
            algoName,
            level,
            link,
            tags,
          };

          resultData.push(resultObj);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  return resultData;
};

const saveDataToDatabase = async (resultData) => {
  for (const resultObj of resultData) {
    const problem = new ProblemModel(resultObj);
    await problem.save();
  }
};

export { fetchDataForAlgorithmLinks, saveDataToDatabase };
