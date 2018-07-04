var db = require("../models");
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
      .sort({_id: -1 })
      .then(function (data) {

        // data.forEach(x => {
        //   console.log("db data",x._id)
        // })

        hbsObject = {
          article: data
        }

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

        result.link = $(this)
          .find(".title-info")
          .find("h1")
          .find("a")
          .attr("href")

        result.summary = ($(this).children("p").text()) || "";

        // console.log("IN",result.summary);

        db.Article.findOneAndUpdate({ title: result.title },result,{upsert: true})
          .then(function (data) {
            //
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