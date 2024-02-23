import * as cheerio from "cheerio";
import axios from "axios";
import { JSDOM } from "jsdom";

export const isSolved = async (problemNum, userBeakId) => {
  const url = `https://www.acmicpc.net/status?from_mine=1&problem_id=${problemNum}&user_id=${userBeakId}`;

  axios
    .get(url, {
      headers: {
        Accept: "application/json",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
      },
    })
    .then((response) => {
      const htmlSnippet = response.data;

      const dom = new JSDOM(htmlSnippet);
      const document = dom.window.document;

      const resultElement = document.querySelector(".result-text");

      const isCorrect = resultElement.textContent.includes("맞았습니다!!");

      // if (isCorrect) {
      //   console.log("맞았습니다!! is present.");
      // } else {
      //   console.log("맞았습니다!! is not present.");
      // }

      return isCorrect;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};
