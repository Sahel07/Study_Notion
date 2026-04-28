const Profile = require("../models/Profile");
const User = require("../models/User");
const { uploadImageToCloudinary } = require("../utilis/imageUploader");

// ----------------------------------------------------------------
// 🟢 Update Profile
// ----------------------------------------------------------------
// controllers/Profile.js — updateProfile (return updated user too)
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, dateOfBirth = "", about = "", contactNumber, gender = "" } =
      req.body;
    const id = req.user.id;

    // find user + profile
    const user = await User.findById(id).populate("additionalDetails");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    let profile = user.additionalDetails;

    // Create profile if missing
    if (!profile) {
      profile = await Profile.create({
        dateOfBirth,
        about,
        contactNumber,
        gender,
      });
      await User.findByIdAndUpdate(id, { additionalDetails: profile._id }, { runValidators: false });
    } else {
      // Update existing profile
      profile.dateOfBirth = dateOfBirth;
      profile.about = about;
      profile.contactNumber = contactNumber;
      profile.gender = gender;
      await profile.save();
    }

    // Update basic user fields safely
    if (firstName || lastName) {
      await User.findByIdAndUpdate(
        id,
        { $set: { ...(firstName && { firstName }), ...(lastName && { lastName }) } },
        { runValidators: false }
      );
    }

    // Fetch fresh user with populated profile
    const updatedUser = await User.findById(id).populate("additionalDetails").select("-password").lean();

    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      profile,        // profile doc
      user: updatedUser, // whole user doc (includes image)
    });
  } catch (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error in Updating Profile",
      error: error.message,
    });
  }
};


// ----------------------------------------------------------------
// 🔴 Delete Account
// ----------------------------------------------------------------
exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User Not Found" });
    }

    if (user.additionalDetails) {
      await Profile.findByIdAndDelete(user.additionalDetails);
    }
    await User.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: "User Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User Cannot Be Deleted",
      error: error.message,
    });
  }
};

// ----------------------------------------------------------------
// 🟡 Get All User Details
// ----------------------------------------------------------------
exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id;
    const userDetails = await User.findById(id).populate("additionalDetails").exec();

    if (!userDetails) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: "User Data Fetched Successfully",
      data: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ----------------------------------------------------------------
// 🟣 Update Display Picture
exports.updateDisplayPicture = async (req, res) => {
  try {
    console.log("🟡 Incoming file data:", req.files);
    console.log("🟡 Incoming user:", req.user);

    if (!req.files || !req.files.displayPicture) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;

    console.log("🟢 File detected:", displayPicture.name);

    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );

    console.log("🟢 Cloudinary response:", image);

    if (!image || !image.secure_url) {
      return res.status(500).json({
        success: false,
        message: "Cloudinary upload failed",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { image: image.secure_url },
      { new: true, runValidators: false }
    ).populate("additionalDetails");

    console.log("✅ Updated user:", updatedUser);

    return res.status(200).json({
      success: true,
      message: "Display Picture Updated Successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("❌ UPDATE DISPLAY PICTURE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Error updating display picture",
      error: error.message,
    });
  }
};




// ----------------------------------------------------------------
// 🟤 Get Enrolled Courses
// ----------------------------------------------------------------
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const userDetails = await User.findById(userId).populate("courses").exec();

    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: `User not found with ID: ${userId}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
