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
    team: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id);
        const team = await Team.findById(user.team);
        return team;
      }
    },
    user: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findById(context.user._id).populate("team");
        return user;
      }

      throw new AuthenticationError("Not logged in");
    },
  },
  Team: {
    async issues(parent, args, ctx, info) {
      const { issues: ids } = parent;
      return await Issue.find({ _id: { $in: ids } });
    },
  },
  Issue: {
    async assignedTo(parent, args, ctx, info) {
      return await User.findOne({ _id: parent.assignedTo });
    },
    async author(parent, args, ctx, info) {
      return await User.findOne({ _id: parent.author });
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
        await Team.findByIdAndUpdate(author.team, { $push: { issues: issue } });
        return issue;
      }
      throw new AuthenticationError("Not logged in");
    },
  },
};

module.exports = resolvers;
