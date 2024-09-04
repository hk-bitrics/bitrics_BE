const axios = require("axios");
const { load } = require("cheerio");

const getHTML = async (keyword) => {
  try {
    const html = await axios
      .get(
        `https://search.hankyung.com/search/news?query=${encodeURI(keyword)}`
      )
      .then((res) => res.data);
    return html;
  } catch {
    console.log("뉴스 사이트내 html 파일 로드중 에러발생");
  }
};

const getNews = async (keyword) => {
  try {
    const html = await getHTML(keyword);
    const $ = load(html);

    const newsHref = $(".article .txt_wrap a")
      .map(function () {
        return $(this).has("em.tit").prop("href");
      })
      .toArray();

    const newsTitle = $(".article .txt_wrap .tit")
      .contents()
      .map(function () {
        return $(this).text();
      })
      .toArray();

    const newsContent = $(".article .txt_wrap p.txt")
      .map(function () {
        return $(this).text();
      })
      .toArray();

    const newsMedia = $(".article .txt_wrap p.info")
      .children("span")
      .not(".date_time")
      .map(function () {
        return $(this).first().text();
      })
      .toArray();

    const newsCreatedAt = $(".article .txt_wrap p.info")
      .children("span.date_time")
      .map(function () {
        return $(this).text();
      })
      .toArray();

    const news = [];
    for (let i = 0; i < newsTitle.length; i++) {
      news.push({
        title: newsTitle[i],
        content: newsContent[i],
        media: newsMedia[i],
        createdAt: newsCreatedAt[i],
        href: newsHref[i],
      });
    }
    return news;
  } catch (e) {
    console.log("뉴스 스크래핑 중 에러 발생", e);
  }
};

module.exports = {
  getNews,
};
