const { signToken } = require('..utils/auth');
const { AuthenticationError } = require('apollo-server-express');
const { User } = require('..models');

const resolvers = {
    Query: {
        users: async () => {
            return User.find({});

        },
        
        user: async (parent, args) => {
            return User.findOne({
                args
            });
        
        },
        me: async (parent, args, context) => {
            if (context.user) {
                const userData = await User.findOne({ _id: context.user_id })
                .select('-__-password')
                return userData
            }
        },

        Mutation: {
            addUser: async (parent, args) => {
                const user = await User.create(args);
                const token = signToken(user);

                return { token, user };
            },
            login: async (parent, { email, password }) => {
                const user = await User.findOne({ email });

                if (!user) {
                    throw new AuthenticationError('Incorrect login information!')
                }

                const correctPw = await user.isCorrectPassword(password);

                if (!correctPw) {
                    throw new AuthenticationError('Incorrect login information!')
                }

                const token = signToken(user);
                return { token, user };


            },

            removeBook: async (parent, { bookId }, context) => {
                if (context.user) {
                    const updatedUser = await User.findOneAndUpdate(
                        { _id: context.user._id },
                        { $pull: { saveBooks: { bookId: bookId }}},
                        { new: true }
                    );
                    return updatedUser;
                }
                throw new AuthenticationError('Login required!');
            },

            saveBook: async (parent, { bookData }, context) => {
                if (context.user) {
                    const updatedUser = await User.findByIdAndUpdate(
                        { _id: context.user._id },
                        { $push: { savedBooks: bookData }},
                        { new: true, runValidators: true }
                    );
                    return updatedUser;
                }

                throw new AuthenticationError('Login Required!');
            },
        }
    }
}

module.exports = resolvers;