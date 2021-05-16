const jwt = require("jwt-then");
const asyncHandler = require("./async");

const User= require("../models/User");


exports.protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(" ")[1];

    // Set token from cookie
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
   return res
    .status(401)
    .json({ success: false, errorMessage: `Not authorized to access this route` });

  }

  try {
  
    //Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);
    next();
  } catch (err) {

    return res
    .status(401)
    .json({ success: false, errorMessage: `Not authorized to access this route` });

  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
 
  return (req, res, next) => {
  
    if (!roles.includes(req.user.role)) {
      return res
      .status( 403)
      .json({ success: false, errorMessage: `User role ${req.user.role} is not authorized to access this route` });
  
    }
    next();
  };
};
