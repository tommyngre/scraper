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
      .sort({ create_date: 1 })
      .populate("note")
      .then(function (data) {
        hbsObject = {
          article: data
        }
        //console.log("db.Article.find({})",hbsObject);
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

      var $ = cheerio.load(response.data);

      // Now, we grab every h2 within an article tag, and do the following:
      $("div.post").each(function (i, element) {
        // Save an empty result object
        var result = {};

        //grab data, assign to result object
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

        result.create_date = Date.now();

        // console.log("IN",result.summary);

        db.Article.find({ title: result.title })
          .then(function (data) {
            //console.log("DATA",data,"LENGTH",data.length)
            
            //if doesn't exist, create
            if (data.length === 0) {
              db.Article.create(result)
                .then(function (dbArticle) {
                  //console.log("OUT",dbArticle);
                })
                .catch(function (err) {
                  return res.json(err);
                });

            };
          })
          .catch(function (err) {
            return res.json(err);
          });

      });
      res.send("Scrape Complete");
    });
  });

  app.get('*', function (req, res) {
    res.render('404');
  });

}