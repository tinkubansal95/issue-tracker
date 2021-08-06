const mongoose = require("mongoose");

const { Schema } = mongoose;

const issueSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Issue = mongoose.model("Issue", issueSchema);

module.exports = Issue;
