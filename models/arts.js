var mongoose = require('mongoose');

var artSchema = new mongoose.Schema({
  name: String,
  aboutArtist: String,
  image: String,
  description: String,
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    username: String,
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
});
module.exports = mongoose.model('art', artSchema);
