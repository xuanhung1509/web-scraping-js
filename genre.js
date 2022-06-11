const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');

const baseUrl = 'https://books.toscrape.com/index.html';

const genreLinks = [];

const getGenre = async (url) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const genreList = $('.nav.nav-list > li > ul > li');

    genreList.each(function () {
      const genreLink =
        'https://books.toscrape.com/' + $(this).find('a').attr('href');
      genreLinks.push(genreLink);
    });

    fs.writeFileSync('genres.json', JSON.stringify(genreLinks));
  } catch (err) {
    console.error(err);
  }
};

getGenre(baseUrl);
