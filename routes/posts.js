var db = require("../models");

module.exports = function (app) {

  app.post("/articles/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry

    //console.log("IN req.body",req.body);

    db.Note.create(req.body)
      .then(function (dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query

        //console.log("OUT req.body",req.body)

        return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { note: dbNote._id } }, { new: true });
      })
      .then(function (dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

  app.put('/notes/:id', function (req, res) {

    console.log("IN (req.body)", req.body);

    db.Note.findOneAndUpdate({ _id: req.body._id }, req.body, { new: true })
      .then(function (dBNote) {
        console.log("OUT (dbNote)", dBNote);
        res.json(dBNote);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        //console.log(err)
        res.json(err);
      });

  })

  app.delete("/notes/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry

    //console.log("DELETE",req.body);

    db.Note.deleteOne({ _id: req.body.noteId })
      .then(function (dbNote) {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.body.articleId }, { $pull: { note: req.body.noteId } });
      })
      .then(function (dbArticle) {
        // If we were able to successfully update an Article, send it back to the client
        res.json(dbArticle);
      })
      .catch(function (err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });


}