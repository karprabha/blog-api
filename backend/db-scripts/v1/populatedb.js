#!/usr/bin/env node

import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import User from "../../src/api/v1/models/user.js";
import Blog from "../../src/api/v1/models/blog.js";
import Comment from "../../src/api/v1/models/comment.js";

const users = [];
const blogs = [];
const comments = [];

const userArgs = process.argv.slice(2);
const mongoDB = userArgs[0];

mongoose.set("strictQuery", false);

async function userCreate(
    first_name,
    family_name,
    username,
    original_password,
    membership_status
) {
    const password = await bcrypt.hash(original_password, 10);
    const user = new User({
        first_name,
        family_name,
        username,
        password,
        membership_status,
    });

    await user.save();
    users.push(user);
    console.log(`Added user: ${username}`);
}

async function blogCreate(user, title, content, published) {
    const blog = new Blog({
        user,
        title,
        content,
        published,
    });

    await blog.save();
    blogs.push(blog);
    console.log(`Added blog: ${title}`);
}

async function commentCreate(user, blog, text) {
    const comment = new Comment({
        user,
        blog,
        text,
    });

    await comment.save();
    comments.push(comment);
    console.log(`Added comment: ${text}`);
}

async function createData() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(mongoDB);

        await userCreate("John", "Doe", "johndoe", "password123", "admin");
        await userCreate("Jane", "Smith", "janesmith", "securepwd", "user");

        await blogCreate(
            users[0],
            "My First Blog Post",
            "This is the content of my first blog post.",
            true
        );
        await blogCreate(
            users[0],
            "Another Blog Entry",
            "This is another blog post.",
            false
        );

        await commentCreate(users[0], blogs[0], "Great post!");
        await commentCreate(users[1], blogs[0], "I enjoyed reading this.");
        await commentCreate(
            users[0],
            blogs[1],
            "Looking forward to more posts."
        );
    } catch (error) {
        console.error("Error populating the database:", error);
    } finally {
        console.log("Closing MongoDB connection...");
        mongoose.connection.close();
    }
}

createData();
