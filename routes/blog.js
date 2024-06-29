const { Router } = require("express");
const Blog = require("../model/blog");
const Comment = require("../model/comment");
const multer = require("multer");
const mongoose = require("mongoose");
const path = require("path");
const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

router.get("/add-new", (req, res) => {
  return res.render("addBlog", {
    user: req.user,
  });
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id).populate("cretedBy");
  const comments = await Comment.find({ blogId: req.params.id }).populate(
    "cretedBy"
  );

  return res.render("blog", { user: req.user, blog, comments });
});

router.post("/", upload.single("coverImage"), async (req, res) => {
  const { title, body } = req.body;

  const blog = await Blog.create({
    title: title,
    body: body,
    cretedBy: req.user._id,
    coverImageUrl: `/uploads/${req.file.filename}`,
  });
  return res.redirect(`/blog/${blog._id}`);
});

router.post("/comment/:blogId", async (req, res) => {
  let blogId = req.params.blogId;
  let blogId1 = blogId.replace(/^:+|:+$/g, "").trim();
  const test1 = await Comment.create({
    content: req.body.content,
    blogId: blogId1,
    cretedBy: req.user._id,
  });
  return res.redirect(`/blog/${blogId1}`);
});
module.exports = router;
