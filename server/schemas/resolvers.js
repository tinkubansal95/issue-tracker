const { AuthenticationError } = require("apollo-server-express");
const { User, Issue, Team } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
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
    addUser: async (parent, { name, email, password, userName, code }) => {
      const team = await Team.findOne({ code });
      console.log(team);
      const user = await User.create({
        name,
        email,
        password,
        userName,
        code,
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
  },
};

module.exports = resolvers;
