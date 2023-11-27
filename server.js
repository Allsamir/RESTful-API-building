require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const connectDB = require('./config/conn');
const dataSchema = require('./mongodb/schema');
const app = express();
const port = process.env.PORT || 3000;

connectDB();

app.set('view engine', 'ejs');

app.use(express.json());

app.use(express.urlencoded({
          extended: true
}));

app.use(express.static('public'));

const Article = mongoose.model("article", dataSchema);

const article1 = new Article({
          title: "JQury",
          content: "JQury is a javascript framework that helps to write javascipt"
});

// article1.save(); // In this app we used postman to test all the requests(get, post, put, patch, delete)

///////// Reqests on our main route ///////// using express route chaining method

app.route('/articles')
          .get(
                    (req, res) => {

                              Article.find()
                                        .then(articles => {
                                                  // res.render('index', {
                                                  //           articles: articles
                                                  // })
                                                  res.send(articles);
                                                  console.log(`Data from Database : ${articles}`);
                                        })
                                        .catch(error => {
                                                  console.log(error)
                                        })
                    })

          .post(async (req, res) => {

                    const newData = new Article({
                              title: req.body.title,
                              content: req.body.content,
                              // ...
                    });

                    try {
                              await newData.save();
                              res.send('Data saved successfully.');
                    } catch (error) {
                              console.error(error);
                              res.send('Error saving data.');
                    }
          })
          .delete((req, res) => {

                    Article.deleteMany({})
                              .then(result => {
                                        console.log(result);
                                        res.send("Data successfully deleted")
                              })
                              .catch(error => {
                                        console.log(error);
                                        res.send("Error for deleting data")
                              })
          });

// //////////// Requests on a specific route // using express route chaining method

app.route('/articles/:specificArticle')

.get((req, res) => {

          const specificArticle = req.params.specificArticle

          Article.find({title: specificArticle})
          .then(article => {
                    console.log(`Article found ${article}`);
                    res.send(article)
          })
          .catch(error => {
                    console.log("Article not found" + error)
                    res.send("Article not found")
          })
})

.put(async (req, res) => { // this is how we can update a data in our database using put http request and using async callback function and findOneAndUpdate method.
    const specificArticle = req.params.specificArticle;

    try {
      const updatedArticle = await Article.findOneAndUpdate(
        { title: specificArticle },
        { title: req.body.title, content: req.body.content },
        { new: true }
      );

      if (updatedArticle) {
        console.log('Article updated successfully:', updatedArticle);
        res.send('Successfully updated article');
      } else {
        console.log('Article not found');
        res.status(404).send('Article not found');
      }
    } catch (error) {
      console.error('Error updating article:', error);
      res.status(500).send('Internal Server Error');
    }
  })

 .patch(async (req, res) => {
  
  const specificArticle = req.params.specificArticle

  try {
    const updateSpecificArticle = await Article.findOneAndUpdate(
      {title: specificArticle},
      {$set: req.body},
      {new: true}
    );

    if (updateSpecificArticle) {
      console.log("Specific Article updated");
      res.send("Article Updated")
    } else {
      console.log("Somthing went wrong");
      res.send("Article not found")
    }
  }
  catch (error){
    console.error(error);
  }
 })

 .delete(async (req, res) => {
  const specificArticle = req.params.specificArticle
  try{
    const deleteSpecificArticle = await Article.deleteOne({title: specificArticle});
    if (deleteSpecificArticle) {
      console.log(`Article successfully deleted`)
      res.send("successfully deleted")
    } else {
      console.log("Something went wrong")
      res.send("Article not deleted")
    }
  }
  catch(error) {
    console.error(error)
  }
 });

app.listen(port, () => {
          console.log(`server is running at ${port}`)
});