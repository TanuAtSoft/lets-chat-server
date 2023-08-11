const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendResponse } = require("../helpers/requestHandlerHelper");

const { sendEmail } = require("../services/emailSender");


exports.registerUser = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  try {
    const userExist = await UserModel.findOne({
      email: req.body.email,
    }).exec();
    if (userExist) {
      return sendResponse(res, true, 400, "email already exists");
    }
    if (!userExist) {
      const user = new UserModel({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: hashedPassword,
        verified: false,
      });
      await user.save();
      const accessToken = jwt.sign(
        {
          email: user.email,
          _id: user._id
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      const userEmail = user.email; // Await the function call to resolve the Promise
      const emailSubject = "Account Verification";
      const emailText = `Hello ${user.firstName} ${user.lastName},

        Kindly click the link below to verify your account.

        https://e-site-flame.vercel.app/verifyBuyerAccount/${accessToken}
    
        Regards,
        E-site Management`;

      await sendEmail(userEmail, emailSubject, emailText);
      return sendResponse(res, true, 200, "user registered successfully");
    }
    
  } catch (e) {
    res.status(400).send(e.message);
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const user = await UserModel.findOne({
    email: req.body.email,
  })
    .select("password")
    .exec();
  const userExist = await UserModel.findOne({
    email: req.body.email,
  }).exec();

  if (userExist) {
    try {
      if (await bcrypt.compare(req.body.password, user.password)) {
        const accessToken = jwt.sign(
          {
            email: userExist.email,
            _id: userExist._id
          },
          process.env.ACCESS_TOKEN_SECRET,
          { expiresIn: "1h" }
        );
        let user;
          user = {
            id: userExist._id,
            name: userExist.firstname + " " + userExist.lastname,
            token: accessToken,
            verified: userExist.verified
          };

        return sendResponse(
          // res.cookie("access_token", accessToken, {
          //   httpOnly: true,
          //   secure: process.env.NODE_ENV === "production",
          // }),
          res,
          true,
          200,
          "logged in successfully",
          { user }
        );
      } else {
        return sendResponse(res, false, 401, "wrong password");
      }
    } catch (e) {
      console.log("e", e);
      return res.send("something went wrong");
    }
  }
  if (!userExist) {
    return sendResponse(res, false, 401, "user does not exist");
  }
};

//reset password 
exports.resetPassword = async (req, res, next) => {
  try {
    const userExist = await UserModel.findOne({ _id: req.user._id });
    if (userExist === null) {
      return sendResponse(res, true, 400, "Invalid Token");
    }

    if (await bcrypt.compare(req.body.oldPassword, userExist.password)) {
      const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
      await UserModel.findByIdAndUpdate(req.user._id, {
        password: hashedPassword,
      });

      return sendResponse(res, true, 200, "Password Changed Sucessfully");
    } else {
      return sendResponse(res, true, 200, "Old Password doesn't match");
    }
    // compare the current time and resetPasswordExpTime
    // if (moment().unix() < user.resetPasswordExpTime) {

    // }
    // return sendResponse(res, true, 200, "Password Reset Link Expired");
  } catch (error) {
    next(error);
  }
};

//forgot password

exports.forgotPassword = async (req, res, next) => {
  try {
    const userExist = await UserModel.findOne({ email: req.body.email });
    if (userExist === null) {
      return sendResponse(res, true, 400, "user doesnot exist");
    }

    if (userExist) {
      const accessToken = jwt.sign(
        {
          email: userExist.email,
          _id: userExist._id,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "300s" }
      );

      const userEmail = userExist.email; // Await the function call to resolve the Promise
      const emailSubject = "Password Reset Link";
      const emailText = `Hello ${userExist.name},

        Kindly click the link below to reset your password.

       ${process.env.RESET_PASSWORD_LINK}/${accessToken}
    
        Regards,
        E-site Management`;

      await sendEmail(userEmail, emailSubject, emailText);
      return sendResponse(
        res,
        true,
        200,
        "Password reset link sent to your email id"
      );
    }
  } catch (error) {
    next(error);
  }
};

exports.verifyUser = async (req, res, next) => {
  try {
    const user = await UserModel.findOne({
      _id: req.user._id,
    });

    if (user.verified)
      return sendResponse(res, true, 200, "User is already verified");
    if (!user.verified) user.verified = true;
    await user.save();
    return sendResponse(res, true, 200, "User is verified successfully");
  } catch (error) {
    next(error);
  }
};

exports.resetPasswordRequest = async (req, res, next) => {
  try {
    const userExist = await UserModel.findOne({ _id: req.user._id });
    if (userExist === null) {
      return sendResponse(res, true, 400, "Invalid Token");
    }
    if (userExist) {
      const hashedPassword = await bcrypt.hash(req.body.newPassword, 10);
      await UserModel.findByIdAndUpdate(req.user._id, {
        password: hashedPassword,
      });
      return sendResponse(
        res,
        true,
        200,
        "Password has been Reset Successfully"
      );
    }
  } catch (e) {
    console.log("e", e);
  }
};
// // Register new user
// exports.registerUser = async (req, res) => {

//   const salt = await bcrypt.genSalt(10);
//   const hashedPass = await bcrypt.hash(req.body.password, salt);
//   req.body.password = hashedPass
//   const newUser = new UserModel(req.body);
//   const {email} = req.body
//   try {
//     // addition new
//     const oldUser = await UserModel.findOne({ email });

//     if (oldUser)
//       return res.status(400).json({ message: "User already exists" });

//     // changed
//     const user = await newUser.save();
//     const token = jwt.sign(
//       { email: user.email, id: user._id },
//       process.env.JWTKEY,
//       { expiresIn: "1h" }
//     );
//     res.status(200).json({ user, token });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Login User

// // Changed
// exports.loginUser = async (req, res) => {
//   const { username, password } = req.body;

//   try {
//     const user = await UserModel.findOne({ username: username });

//     if (user) {
//       const validity = await bcrypt.compare(password, user.password);

//       if (!validity) {
//         res.status(400).json("wrong password");
//       } else {
//         const token = jwt.sign(
//           { username: user.username, id: user._id },
//           process.env.JWTKEY,
//           { expiresIn: "1h" }
//         );
//         res.status(200).json({ user, token });
//       }
//     } else {
//       res.status(404).json("User not found");
//     }
//   } catch (err) {
//     res.status(500).json(err);
//   }
// };
