/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const BookModel = require("../models/book.model.js");

module.exports = function (app) {

  app.route('/api/books')
    .get(async function (req, res){
      try {
        const listBook = await BookModel.find();
        const response = listBook.map((book) => ({
          _id: book._id,
          title: book.title,
          commentcount: book.comments.length
        }))
        return res.json(response);
      } catch (err) {
        console.log(err);
        return res.send('System error');
      }
      
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })
    
    .post(async function (req, res){
      try {
        let title = req.body.title;
        if (!title) {
          return res.send('missing required field title');
        }
        const created = await BookModel.create({ title });
        // console.log(created);
        const response = {
          title: created.title,
          _id: created._id
        }
        return res.json(response);
      } catch(err) {
        console.log(err);
        return res.send('System error');
      }
      
      //response will contain new book object including atleast _id and title
    })
    
    .delete(async function(req, res){
      //if successful response will be 'complete delete successful'
      try {
        const deleteAll = await BookModel.deleteMany();
        console.log(deleteAll);
        return res.send('complete delete successful');
      } catch (err) {
        console.log(err);
        return res.send('System error');
      }
    });



  app.route('/api/books/:id')
    .get(async function (req, res){
      try {
        let bookid = req.params.id;
        const findBookByBookId = await BookModel.findOne({ _id: bookid });
        if (!findBookByBookId) {
          return res.send('no book exists');
        }
        const response = {
          _id: findBookByBookId._id,
          title: findBookByBookId.title,
          comments: findBookByBookId.comments
        }
        return res.json(response);
      } catch (err) {
        console.log(err);
        return res.send('System error');
      }
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })
    
    .post(async function(req, res){
      try {
        let bookid = req.params.id;
        let comment = req.body.comment;
  
        if (!comment) {
          return res.send('missing required field comment');
        }
        
        const findBookByBookId = await BookModel.findOne({ _id: bookid });
        if (!findBookByBookId) {
          return res.send('no book exists');
        }
  
        const updated = await BookModel.findOneAndUpdate(
          { _id: bookid },
          {
            $push: {
              comments: comment
            }
          },
          { new: true }
        );
  
        const response = {
          _id: updated._id,
          title: updated.title,
          comments: updated.comments
        };
  
        return res.json(response);
      } catch (err) {
        console.log(err);
        return res.send('System error');
      }
      
      //json res format same as .get
    })
    
    .delete(async function(req, res){
      let bookid = req.params.id;
      const deleted = await BookModel.deleteOne({ _id: bookid });
      // console.log(deleted);
      if (!deleted || deleted.deletedCount < 1) {
        return res.send('no book exists');
      }
      res.send('delete successful');
      //if successful response will be 'delete successful'
    });
  
};
