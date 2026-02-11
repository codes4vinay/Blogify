const express = require('express');
require('dotenv').config()
const path = require('path');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const { checkForAuth } = require('./middlewares/auth');
const cookieParser = require('cookie-parser');
const blogRoutes = require('./routes/blog');
const Blog = require('./models/blog');

const app = express();
const PORT = process.env.PORT;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(checkForAuth("token"));
app.use('/uploads', express.static(path.resolve('./uploads')));
app.use(express.static('public'));


mongoose.connect(process.env.MONGO_URI).then(
    e => console.log("MongoDB connected successfully!")
).catch(
    e => console.log("MongoDB connection ERROR!")
)

app.set('view engine', 'ejs');
app.set('views', path.resolve("./views"));

app.use('/user', userRoutes);
app.use('/blog', blogRoutes);

app.get('/', async (req, res) => {
    const allBlogs = await Blog.find({});
    return res.render('home', {
        user: req.user,
        blogs: allBlogs
    });
})

app.listen(PORT, () => {
    console.log(`Server started on Port ${PORT}`);
})