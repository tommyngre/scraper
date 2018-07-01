module.exports = {
  Article: require("./Article"),
  Note: require("./Note")
};

//to find only articles with notes
//db.articles.find({note: {$exists: true}}).pretty()