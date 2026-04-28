const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utilis/imageUploader");

const fs = require("fs");
const path = require("path");


exports.createSubSection = async (req, res) => {
  try {
      // Log incoming files to check if 'videoFile' exists
      console.log("Received files:", req.files);

      // Fetch data from request body
      const { sectionId, title, description } = req.body;

      // Extract video file from request
      const video = req.files.videoFile;
      
      // Validation
      if (!sectionId || !title || !description || !video) {
          return res.status(400).json({
              success: false,
              message: 'All Fields are Required',
          });
      }

      // Upload video file to Cloudinary
      const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
      console.log("Cloudinary Upload Details:", uploadDetails);

      // Create a sub-section with the uploaded video details
      const subSectionDetails = await SubSection.create({
          title: title,
          timeDuration: `${uploadDetails.duration}`,
          description: description,
          videoUrl: uploadDetails.secure_url,
      });
      console.log("SubSection Details:", subSectionDetails);

      // Update the corresponding section with the new sub-section
      const updatedSection = await Section.findByIdAndUpdate(
          { _id: sectionId },
          { $push: { subSection: subSectionDetails._id } },
          { new: true }
      ).populate("subSection");
      
      console.log("Updated Section:", updatedSection);

      // Return the updated section in the response
      return res.status(200).json({
          success: true,
          data: updatedSection,
      });
      
  } catch (error) {
      // Handle any error that occurs during the process
      console.error("Error creating a new sub-section: ", error);
      return res.status(500).json({
          success: false,
          message: 'Internal Server Error',
          error: error.message,
      });
  }
};



exports.updateSubSection = async (req, res) => {
  try {
      const { sectionId, title, description } = req.body;  // ✅ Use subSectionId

      // Find the SubSection using the correct ID
      const subSection = await SubSection.findById(sectionId);
      if (!subSection) {
          return res.status(404).json({
              success: false,
              message: "SubSection not found",
          });
      }

      // Update fields if provided
      if (title !== undefined) {
          subSection.title = title;
      }
      if (description !== undefined) {
          subSection.description = description;
      }

      // Handle video update
      if (req.files && req.files.video !== undefined) {
          const video = req.files.video;

          // **Delete old video from Cloudinary**
        //   if (subSection.videoUrl) {
        //       const publicId = subSection.videoUrl.split("/").pop().split(".")[0];
        //       await cloudinary.uploader.destroy(publicId, { resource_type: "video" });
        //   }

          // Upload new video to Cloudinary
          const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);
          subSection.videoUrl = uploadDetails.secure_url;
          subSection.timeDuration = `${uploadDetails.duration}`;
      }

      // Save the updated SubSection
      await subSection.save();
      const updatedSection = await Section.findById(sectionId).populate("subSection")

      return res.json({
          success: true,
          message: "SubSection updated successfully",
          data: updatedSection,
      });

  } catch (error) {
      console.error("Error updating SubSection:", error);
      return res.status(500).json({
          success: false,
          message: "An error occurred while updating the SubSection",
          error: error.message,
      });
  }
};
exports.deleteSubSection = async(req,res)=>{
  try{
    const{subSectionId,sectionId} = req.body;
    if (!subSectionId) {
      return res.status(400).json({ success: false, message: "SubSection ID is required" });
    }
    const subSection = await SubSection.findByIdAndDelete({_id:subSectionId});
    if(!subSection){
      return res.status(404).json({
        succcess:false,
        message:"subsection not found",
      })
    }
    const updatedSection = await Section.findById(sectionId).populate("subSection")
    return res.status(200).json({ success: true,data:updatedSection, message: "SubSection deleted successfully" });

  } catch (error) {
    console.error("Error deleting SubSection:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
}