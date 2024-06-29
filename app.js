require("dotenv").config();
const express = require("express");
const path = require("path");
const userRoute = require("./routes/user");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middleware/auth");
const blogRouter = require("./routes/blog");
const Blog = require("./model/blog");

const PORT = process.env.PORT || 8000;
const app = express();
console.log(process.env.MONGO_URL);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("MongoDB is Connected");
  })
  .catch((err) => {
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));

app.get("/", async (req, res) => {
  const allBlog = await Blog.find({});
  return res.render("home", { user: req.user, blogs: allBlog });
});
app.use("/user", userRoute);
app.use("/blog", blogRouter);
app.listen(PORT, () => {
  console.log(`Server is Listing on PORT ${PORT}`);
});
