const User = require("../models/User");

exports.register = async (req, res) => {
  const { name, email, password, location } = req.body;

  // Validate details
  if (!email || !password || !name) {
    return res.status(400).json({
      message: "Please provide an email, password and a name",
    });
  }

  // Check if user is already exist
  let Euser = await User.findOne({ email });

  if (Euser) {
    return res.status(400).json({
      message: "User already exists!",
    });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    location,
  });

  sendTokenResponse(user, 200, res);
};

exports.login = async (req, res) => {
  const { email, password, device } = req.body;

  // Validate email & password
  if (!email || !password) {
    return res.status(400).json({
      message: "Please provide an email and password",
    });
  }

   // Validate sender
   if (!device) {
    return res.status(400).json({
      message: "Please specify sending device",
    });
  }

  if (device!=="Web" && device!="Mobile") {
    return res.status(400).json({
      message: "Invalid device type",
    });
  }


  // Check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  // Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({
      message: "Invalid credentials",
    });
  }

  if(user.role!="Admin" && device=="Web"){
    return res.status(403).json({
      message: "Not authorized",
    });
  }

  sendTokenResponse(user, 200, res);
};

// @desc    Update user location
// @route   PUT /users/location/:id
// @access  Private/Admin

exports.updateUser =async (req, res,next) => {

  // const { location } = req.body;

  let user = await User.findById(req.params.id);
 
  if (!user) {
    return next(
      res.status(400).json({
        message: `User not found with id of ${req.params.id}`,
      })
    );
  }

   
  // if (!location.latitude || !location.longitude) {
  //   return next(
  //     res.status(400).json({
  //       message: `latitude or longitude is missing`,
  //     })
  //   );
  // }

   user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: user,
  });
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true,userID:user.id,notificationStatus:user.notifications,token });
};
