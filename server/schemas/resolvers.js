const {
  AuthenticationError,
  UserInputError,
} = require("apollo-server-express");
const { User, Issue, Team } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    users: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id);
        const users = await User.find({ team: user.team });
        return users;
      }

      throw new AuthenticationError("Not logged in");
    },
    issues: async () => {
      return await Issue.find();
    },
    user: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate("team");
        return user;
      }

      throw new AuthenticationError("Not logged in");
    },
  },
  Mutation: {
    addUser: async (
      parent,
      { name, email, password, userName, code, designation }
    ) => {
      const emailUser = await User.findOne({ email });
      if (emailUser) {
        throw new AuthenticationError("Email Taken");
      }
      const team = await Team.findOne({ code });
      if (!team) {
        team = await Team.create({ name, code });
      }
      const user = await User.create({
        name,
        email,
        password,
        userName,
        team,
        designation,
      });

      const token = signToken(user);
      return { token, user };
    },

    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("Incorrect credentials");
      }

      const token = signToken(user);

      return { token, user };
    },

    addTeam: async (__, { name, code }) => {
      const team = await Team.create({ name, code });
      return team;
    },

    addIssue: async (
      __,
      { title, description, status, assignedTo },
      context
    ) => {
      const author = await User.findById(context.user._id);
      let assigned;
      assignedTo === "you"
        ? (assigned = context.user._id)
        : (assigned = assignedTo);
      if (!!author) {
        const issue = await Issue.create({
          title,
          description,
          status,
          author,
          day: new Date(),
          assignedTo: assigned,
        });
        return issue;
      }
      throw new AuthenticationError("Not logged in");
    },
  },
};

module.exports = resolvers;
