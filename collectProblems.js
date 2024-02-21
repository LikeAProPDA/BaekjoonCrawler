import * as cheerio from "cheerio";
import axios from "axios";

const url = "https://github.com/tony9402/baekjoon/tree/main/data_structure";

try {
  const response = await axios.get(url);
  const html = response.data;
  const $ = cheerio.load(html);

  // JSON 데이터 가져오기
  const jsonData = $('script[data-target="react-app.embeddedData"]').html();
  const parsedData = JSON.parse(jsonData);

  console.log("###########");

  const boj = parsedData.payload.tree.readme.richText;
  const boj$ = cheerio.load(boj);
  const tbody = boj$("table tbody tr");

  const bojData = tbody.map(async (index, elem) => {
    const el = boj$(elem);

    const problemNum = el.find("td:eq(2)").text(); // 백준 문제 번호
    const problemName = el.find("td:eq(3)").text(); // 백준 문제 이름
    const problemLink = el.find("td:eq(2) a").attr("href"); // 백준 문제 링크
    console.log(problemName + " " + problemNum + " " + problemLink);
  });

  console.log("###########");

  // 링크 및 텍스트 추출
  const linksAndTexts = [];

  const extractLinks = (items, basePath) => {
    items.forEach((item) => {
      const itemPath = `${basePath}/${item.path}`;
      const link = `https://github.com/${parsedData.payload.repo.ownerLogin}/${parsedData.payload.repo.name}/blob/${parsedData.payload.refInfo.name}/${itemPath}`;
      const text = item.name;

      linksAndTexts.push({ link, text });

      if (item.type === "tree") {
        // 디렉토리인 경우 재귀적으로 하위 링크 추출
        extractLinks(item.items, itemPath);
      }
    });
  };

  extractLinks(parsedData.payload.tree.items, "");

  // 추출된 데이터 사용
  // console.log(linksAndTexts);
} catch (error) {
  console.error("Error fetching data:", error);
}
