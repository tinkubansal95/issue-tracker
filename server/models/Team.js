const mongoose = require("mongoose");

const { Schema } = mongoose;
const Issue = require("./Issue");

const teamSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  code: {
    type: Number,
    unique: true,
  },
  issues: [Issue.schema],
});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;
