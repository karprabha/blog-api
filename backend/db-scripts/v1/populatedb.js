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
    role
) {
    const password = await bcrypt.hash(original_password, 10);
    const user = new User({
        first_name,
        family_name,
        username,
        password,
        role,
    });

    await user.save();
    users.push(user);
    console.log(`Added user: ${username}`);
}

async function blogCreate(
    author,
    title,
    cover_image_url,
    cover_image_credit,
    content,
    published
) {
    const blog = new Blog({
        author,
        title,
        cover_image_url,
        cover_image_credit,
        content,
        published,
    });

    await blog.save();
    blogs.push(blog);
    console.log(`Added blog: ${title}`);
}

async function commentCreate(author, blogPost, text) {
    const comment = new Comment({
        author,
        blogPost,
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

        await userCreate("John", "Doe", "johndoe", "Password@123", "admin");
        await userCreate("Jane", "Smith", "janesmith", "Secure@pwd123", "user");

        await blogCreate(
            users[0],
            "My First Blog Post",
            "https://res.cloudinary.com/dn3rb7yf5/image/upload/v1698014147/samples/landscapes/beach-boat.jpg",
            "cloudinary",
            "# This is the content of my first blog post.",
            true
        );
        await blogCreate(
            users[0],
            "Another Blog Entry",
            "https://res.cloudinary.com/dn3rb7yf5/image/upload/v1698014147/samples/landscapes/beach-boat.jpg",
            "cloudinary",
            "# This is another blog post.",
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
