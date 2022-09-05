const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    comments: [
      {
        type: String,
        default: null
      }
    ]
  },
  {
    collection: 'Book',
    versionKey: false,
    timestamps: true
  }
);

module.exports = mongoose.model(BookSchema.options.collection, BookSchema);