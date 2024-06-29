const { Router } = require("express");
const User = require("../model/user");
const router = Router();

router.get("/signin", (req, res) => {
  return res.render("Signin");
});

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);

    return res.cookie("token", token).redirect("/");
  } catch (error) {
    return res.render("Signin", { err: "Incorect Email or password" });
  }
});

router.get("/signup", (req, res) => {
  return res.render("Signup");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    await User.create({
      fullName,
      email,
      password,
    });
    res.redirect("/");
  } catch (error) {
    next(error);
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

module.exports = router;
