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
  console.log(linksAndTexts);
} catch (error) {
  console.error("Error fetching data:", error);
}