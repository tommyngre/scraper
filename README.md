# scraper
The "/Film Scraper" is comment board style application. When the page loads, it employs `cheerio` to scrape articles from http://www.slashfilm.com/. The headline, introductory sentences, and a link to each sraped article are drawn to the page, as well as UI elements which allow users to comment.

## implementation
The "/Film Scraper" essentially is a one page app built with `node`, `cheerio`, `express` and `express-handlebars`, `bootstrap 4.0`, `mongodb` and `mongoose'. The CRUD operations it performs are as follows.
* CREATE comments
* READ articles and comments
* UPDATE comments
* DELETE comments

See it hosted on Heroku, connected to an mLab MongoDB, [here](https://quiet-reaches-87402.herokuapp.com/).

Note:
* The frontend UI implementation is currently minimal - default Bootstrap styles, plus Font Awesome icons.
* Currently, any user can modify (and delete) any comment. In the future, I would implement user profiles, and restrict write operations on comments based on author/user.