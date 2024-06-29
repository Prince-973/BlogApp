const mongoose = require("mongoose");
const { createHmac, randomBytes } = require("crypto");
const { createTokenForuser } = require("../sevice/auth");
const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageUrl: {
      type: String,
      required: true,
      default: "/images/default.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

UserSchema.static(
  "matchPasswordAndGenerateToken",
  async function (email, password) {
    const user = await this.findOne({ email: email });
    if (!user) {
      throw new Err("User Not Found");
    }

    const salt = user.salt;
    const hashedPassWord = user.password;
    const userProvidedHash = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    if (userProvidedHash !== hashedPassWord) {
      throw new Err("Incorrect PassWord");
    }

    const token = createTokenForuser(user);
    return token;
  }
);

UserSchema.pre("save", function (next) {
  const user = this;
  if (!user.isDirectModified("password")) {
    return;
  }
  const salt = randomBytes(16).toString();
  const hashedPassWord = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");
  this.salt = salt;
  this.password = hashedPassWord;

  next();
});

const User = mongoose.model("user", UserSchema);
module.exports = User;
