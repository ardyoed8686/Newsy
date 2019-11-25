var Note = require("../models/Note");
// var makeDate = require("../routes/date");

module.exports = {
  get: function(data, cb) {

    Note.find({
      _articleId: data._id
    }, cb);
  },

  save: function(data, cb) {

    var newNote = {
      _articleId: data._id,
      // date: makeDate(),
      noteText: data.noteText
    };

     Note.create(newNote, function(err, doc) {

      if (err) {
        console.log(err);
      }

      else {
        console.log(doc);
    
        cb(doc);
      }
    });
  },
  delete: function(data, cb) {

    Note.remove({
      _id: data._id
    }, cb);
  }
};