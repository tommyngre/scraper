var db = require("../models");
//var request = require('request');
var axios = require('axios');
var cheerio = require('cheerio');

module.exports = function (app) {

  //SHOW JSON OF SCRAPE
  app.get("/api", function (req, res) {

    res.json(req);

  })

  //RENDER FROM
  app.get("/", function (req, res) {

    db.Article.find({})
      .populate("note")
      .then(function (data) {
        hbsObject = {
          article: data
        }
        //console.log(hbsObject);
        res.render('index', hbsObject);
      })
      .catch(function (err) {
        res.json(err);
      })

  })

  // SCRAPE TO MONGO
  app.get("/scrape", function (req, res) {
    // First, we grab the body of the html with request
    axios.get("https://slashfilm.com/").then(function (response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      //console.log("response.data",response)

      var $ = cheerio.load(response.data);

      // Now, we grab every h2 within an article tag, and do the following:
      $("div.post").each(function (i, element) {
        // Save an empty result object
        var result = {};

        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this)
          .find(".title-info")
          .find("h1")
          .find("a")
          .attr("title")
        //.text();

        result.link = $(this)
          .find(".title-info")
          .find("h1")
          .find("a")
          .attr("href")

        result.summary = $(this)
          .children("p").text();

        //console.log("IN",result.summary);

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function (dbArticle) {
            // View the added result in the console
            //console.log("OUT",dbArticle);
          })
          .catch(function (err) {
            // If an error occurred, send it to the client
            return res.json(err);
          });
      });

      // If we were able to successfully scrape and save an Article, send a message to the client
      res.send("Scrape Complete");
    });
  });


  app.get('*', function (req, res) {
    res.render('404');
  });

}