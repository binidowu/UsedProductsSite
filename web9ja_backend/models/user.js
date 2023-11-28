const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs");

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, "Please fill a valid e-mail address"],
      trim: true,
      lowercase: true,
      immutable: true,
    },
    username: {
      type: String,
      unique: true,
      required: "Username is required",
      trim: true,
      locationbar: true,
      immutable: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    profilePicture: {
      type: String,
      trim: true,
    },
    hashedPassword: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    favorites: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ad",
      },
    ],
    postedAds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ad",
      },
    ],
  },
  {
    collection: "user",
  }
);

userSchema.virtual("password").set(function (password) {
  if (password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  } else {
    const hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    this.hashedPassword = hash;
  }
});

userSchema.methods.authenticate = async function (password) {
  try {
    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, this.hashedPassword);
    return isMatch; // true or false
  } catch (error) {
    throw new Error(error);
  }
};

// Omit the hashed password when returning a user
userSchema.methods.toJSON = function () {
  var obj = this.toObject();
  delete obj.hashedPassword;
  return obj;
};

const User = mongoose.model("User", userSchema);

module.exports = User;

/*
We are going to use bycrpt instead of crypto to hash our passwords.
reasons:
1. bcrypt is generally considered more secure for password storage because of its built-in salt and work factor, which crypto does not provide for password hashing without additional implementation.
2. bcrypt includes a "work factor", which is a measure of how slow the hash function is. A higher work factor makes the hashing process slower, which makes it more resistant to brute-force attacks because it takes more time and computational power to hash and test each potential password.
3. bycrpt It’s designed to protect against password hash collisions (where two different passwords produce the same hash).
4. The hashing functions in crypto are generally faster than bcrypt, which is actually a disadvantage for password hashing because it makes brute-force attacks easier.
 */

//sample data from frontend for creating user:
/*
{
 "firstName": "Yusuf",
        "lastName": "Opeyemi",
        "email": "yadeleke@maily.com",
        "username": "yadeleke",
        "phone": "08012345678",
        "address": "Lagos",
        "profilePicture": "https://res.cloudinary.com/web9ja/image/upload/v1621314461/ads/1621314460393.jpg",
        "bio": "I am a web developer",
        "password": "123456
    }
 */
