const cheerio = require('cheerio');
const axios = require('axios');
const { parse } = require('json2csv');
const fs = require('fs');

const url =
  'https://books.toscrape.com/catalogue/category/books/mystery_3/index.html';
const baseUrl =
  'https://books.toscrape.com/catalogue/category/books/mystery_3/';

const bookData = [];

const getBooks = async (url) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const books = $('article.product_pod');

    books.each(function () {
      const title = $(this).find('h3 > a').text();
      const price = $(this).find('.product_price > .price_color').text();
      const stock = $(this).find('.instock.availability').text().trim();

      bookData.push({ title, price, stock });
    });

    if ($('.next > a').length > 0) {
      const nextPage = baseUrl + $('.next > a').attr('href');
      getBooks(nextPage);
    } else {
      const csv = parse(bookData);
      fs.writeFileSync('./books.csv', csv);
    }
  } catch (err) {
    console.error(err);
  }
};

getBooks(url);
