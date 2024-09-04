const { getNews } = require("../services/news");

exports.getNews = async (req, res) => {
  try {
    const data = await getNews(req.params.keyword);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error(error);
  }
};
