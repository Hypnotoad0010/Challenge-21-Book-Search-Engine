const { gql } = require('apollo-server-express');

const typeDefs = gql `
type User {
    _id: ID
    username: String
    email: String
    bookCount: Int
    savedBooks: [Book]
}

type Query {
    me: User
    users: [User]
    user(usernam: String!): User
}

type Auth {
    token: ID!
    user: User
}

type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    deleteBook(bookId: ID!): User
}

type Book {
    bookId: ID
    title: String
    authors: [String]
    description: String
    image: String
    link: String
}

input BookInput {
    bookId: ID
    authors: [String]
    description: String
    image: String
    link: String
    title: String
}

`;

module.exports = typeDefs;