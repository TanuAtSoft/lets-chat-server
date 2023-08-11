const jwt = require("jsonwebtoken");
const { sendResponse } = require("../helpers/requestHandlerHelper");

const authenticated = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return sendResponse(res, false, 401, "Access token not found");
    } else {
      const token = req.headers.authorization.split(" ");
      req.user = await jwt.verify(
        token[1].trim(),
        process.env.ACCESS_TOKEN_SECRET
      );
      next();
    }
  } catch (error) {
    next(error);
    return sendResponse(res, false, 401, "invalid token");
  }
};

// Grant access to specific roles
const authorize = (roles) => {
  return (req, res, next) => {
    // console.log("req.user", req.user)
    if (!roles.includes(req.user.role)) {
      return res.status(401).json({
        status: false,
        statusCode: 401,
        statusMessage: "Not authorized to perform this action",
      });
    }
    next();
  };
};

module.exports = {
  authenticated,
  authorize,
};
