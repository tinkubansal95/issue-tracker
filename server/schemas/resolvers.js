const {
  AuthenticationError,
  UserInputError,
} = require("apollo-server-express");
const { User, Issue, Team } = require("../models");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    users: async (parent, args, context) => {
      try{
        if (context.user) {
          const user = await User.findById(context.user._id);
          const users = await User.find({ team: user.team });
          return users;
        }
  
        throw new AuthenticationError("Not logged in");
      }
      catch(err){
        console.log(err)
      }
    },
    team: async (parent, args, context) => {
      try{
        if (context.user) {
          const user = await User.findById(context.user._id);
          const team = await Team.findById(user.team);
          return team;
        }
      }
      catch(err){
        console.log(err);
      }
    },
    user: async (parent, args, context) => {
      try{
        if (context.user) {
          const user = await User.findById(context.user._id).populate("team");
          return user;
        }
  
        throw new AuthenticationError("Not logged in");
      }
      catch(err){
        console.log(err)
      }
  },
  Team: {
    async issues(parent, args, ctx, info) {
      try {
        const { issues: ids } = parent;
        return await Issue.find({ _id: { $in: ids } });
      } catch (err) {
        console.log(err);
      }
    },
  },
  Issue: {
    async assignedTo(parent, args, ctx, info) {
      try {
        return await User.findOne({ _id: parent.assignedTo });
      } catch (err) {
        console.log(err);
      }
    },
    async author(parent, args, ctx, info) {
      try {
        return await User.findOne({ _id: parent.author });
      } catch (err) {
        console.log(err);
      }
    },
  },
  Mutation: {
    updateStatus: async (_, { _id, status }) => {
      try {
        return await Issue.findByIdAndUpdate(_id, { status }, { new: true });
      } catch (err) {
        console.log(err);
      }
    },
    updateAssignedTo: async (_, { _id, assignedTo }) => {
      try {
        const user = await User.findOne({ _id: assignedTo });
        return await Issue.findByIdAndUpdate(
          _id,
          { assignedTo: user },
          { new: true }
        );
      } catch (err) {
        console.log(err);
      }
    },
    addUser: async (
      parent,
      { name, email, password, userName, code, designation }
    ) => {
      try {
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
      } catch (err) {
        console.log(err);
      }
    },

    login: async (parent, { email, password }) => {
      try {
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
      } catch (err) {
        console.log(err);
      }
    },

    addTeam: async (__, { name, code }) => {
      try {
        const team = await Team.create({ name, code });
        return team;
      } catch (err) {
        console.log(err);
      }
    },

    addIssue: async (
      __,
      { title, description, status, assignedTo },
      context
    ) => {
      try {
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
          await Team.findByIdAndUpdate(author.team, {
            $push: { issues: issue },
          });
          return issue;
        }
        throw new AuthenticationError("Not logged in");
      } catch (err) {
        console.log(err);
      }
    },
  },
};

module.exports = resolvers;
