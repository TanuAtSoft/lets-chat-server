const router = require("express").Router();
const authController = require("../controllers/authController");
const {
  authenticated,
  authorize,
} = require("../middlewares/authenticated.middleware");
// const {
//   loginValidation,
//   registerValidation,
//   changePasswordValidation,
//   forgotPasswordValidation,
//   changePasswordRequestValidation
// } = require("../validators/auth.validators");

router.post("/auth/register", authController.register);

 router.post("/auth/login",  authController.login);
 router.post("/auth/forgotPassword", authController.forgotPassword);

router.post("/auth/resetPassword", authenticated, authController.resetPassword);

router.post(
  "/auth/resetPasswordRequest",
  authenticated,
  authController.resetPasswordRequest
);

router.patch(
  "/verifyUser",
  authenticated,
  authController.verifyUser
);

// router.post("/forgotPassword",forgotPasswordValidation, authController.forgotPassword);
// router.post(
//   "/resetPasswordRequest",
//   changePasswordRequestValidation,
//   authenticated,
//   authController.resetPasswordRequest
// );

module.exports = router;