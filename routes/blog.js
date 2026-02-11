const express = require('express');
const Blog = require('../models/blog');
const multer = require('multer');
const path = require('path');


const router = express.Router();


const Storage = multer.diskStorage({
    destination: function name(req, file, cb) {
        cb(null, path.resolve(`./uploads/`));
    },
    filename: function name(req, file, cb) {
        const fileName = `${Date.now()}-${file.originalname}`;
        cb(null, fileName);
    }
})

const upload = multer({ storage: Storage });


router.get('/add-new', (req, res) => {
    return res.render('addBlog', {
        user: req.user,
    })
})

router.post('/', upload.single('coverImage'), async (req, res) => {
    const { title, body } = req.body;
    const blog = await Blog.create({
        body,
        title,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`
    })
    return res.redirect(`/blog/${blog._id}`)
})

router.get('/:id', async (req, res) => {
    const id = req.params.id;
    const blog = await Blog.findById(id).populate("createdBy");
    return res.render('blog', { user: req.user, blog });
})

router.post('/delete/:id', async (req, res) => {
    const id = req.params.id;
    const blog = await Blog.findById(id);
    if (!blog) {
        return res.redirect('/');
    }
    await Blog.findByIdAndDelete(id);
    return res.redirect('/user/my-blogs');
})

module.exports = router;