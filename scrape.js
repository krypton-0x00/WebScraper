import puppeteer from "puppeteer";
import fs from "fs";

const scrape = async () => {
  //create a puppeteer browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const allBooks = [];
  let currentPage = 1;
  const maxPages = 5;

  while (currentPage <= maxPages) {
    const url = ` https://books.toscrape.com/catalogue/page-${currentPage}.html`;

    await page.goto(url);
    //   const title = await page.title();
    //   console.log(title);
    //run js in the context of page
    const books = await page.evaluate(() => {
      const bookElements = document.querySelectorAll(".product_pod");
      return Array.from(bookElements).map((book) => {
        const title = book.querySelector("h3 a").innerText;
        const price = book.querySelector(".price_color").innerText;
        const stock = book.querySelector(".instock availability")
          ? "INSTOCK:"
          : "OUT OF STOCK";
        const rating = book
          .querySelector(".star-rating")
          .className.split(" ")[1];
        return {
          title,
          price,
          stock,
          rating,
        };
      });
    });
    allBooks.push(...books);
    console.log(`Page ${currentPage} scraped`);
    currentPage++;
  }
  console.log("Data Saved");
  fs.writeFileSync("books.json", JSON.stringify(allBooks, null, 2));
  await browser.close();
};
scrape();
