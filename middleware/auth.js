const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

exports.auth = async (req, res, next) => {
  try {
    const rawAuthHeader = req.header("Authorization");
    console.log("Authorization Header:", rawAuthHeader);

    const token = req.cookies.token 
               || req.body.token 
               || (rawAuthHeader ? rawAuthHeader.replace("Bearer ", "") : null);

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token Is Missing",
      });
    }

    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decode;
      console.log("Decoded Token:", decode);
    } catch (error) {
      console.log("JWT verification failed:", error.message);  // Logs specific error
      return res.status(401).json({
        success: false,
        message: "Token is invalid: " + error.message,  // Add the specific error message to debug
      });
    }
    next();
  } catch (error) {
    console.error("Error during token verification:", error.message);
    return res.status(401).json({
      success: false,
      message: "Something Went Wrong While Verifying Token",
    });
  }
};

//isStudent
exports.isStudent = async (req, res, next) => {
    try {

        if(req.user.accountType !== 'Student') {
            return res.status(401).json({
                success: false,
                message: 'This Is A Protectd Route For Students'
            })
        }
        next();

    } catch(error) {
        return res.status(500).json({
            success: false,
            message: 'User Role Cannot Be Verified, Please Try Again'
        })
    }
}

//isInstructor
exports.isInstructor = async (req, res, next) => {
    try {

        if(req.user.accountType !== 'Instructor') {
            return res.status(401).json({
                success: false,
                message: 'This Is A Protectd Route For Instructor'
            });
        }
        next();

    } catch(error) {
        return res.status(500).json({
            success: false,
            message: 'User Role Cannot Be Verified, Please Try Again'
        })
    }
}


//isAdmin
exports.isAdmin = async (req, res, next) => {
    try {

        if(req.user.accountType !== 'Admin') {
            return res.status(401).json({
                success: false,
                message: 'This Is A Protectd Route For Admin'
            })
        }
        next();
        
    } catch(error) {
        return res.status(500).json({
            success: false,
            message: 'User role Cannot Be Verified, Please Try Again'
        })
    }
}