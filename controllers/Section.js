const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection"); // ✅ CORRECT

// const mongoose = require("mongoose");


exports.createSection = async (req, res) => {
    try {
        //data fetch 
        const {sectionName, courseId} = req.body;
        //data validation
        if(!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: 'Missing required properties'
            });
        }
        //create a new section
        const newSection = await Section.create({sectionName});
        //update course with setion objectID
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    courseContent: newSection._id,
                }
            },
            {new: true},
        )
        //HW: use populate to replace section /sub-section both in the updatedCourseDetails
            .populate({
                path: "courseContent",
                populate: {
                    path: "subSection",
                },
            })
            .exec();

        //return updated course object in response
        return res.status(200).json({
            success: true,
            message: 'Section Created Successfully',
            updatedCourseDetails,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            error: error.message,
        })
    }
}


exports.updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId, courseId } = req.body;

    if (!sectionName || !sectionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing Properties",
      });
    }

    // ✅ Save the result of the update
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    console.log("🟡 Updated Section:", updatedSection);

    const updatedCourse = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    console.log("✅ updatedCourse is:", updatedCourse);
    console.log("🔍 FINAL API RESPONSE:", {
      success: true,
      message: updatedSection,
      updateCourseDetails: updatedCourse,
    });

    return res.status(200).json({
      success: true,
      message: updatedSection,
      updateCourseDetails: updatedCourse,
    });
  } catch (error) {
    console.error("❌ UPDATE SECTION ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Unable to update section",
      error: error.message,
    });
  }
};


exports.deleteSection = async (req, res) => {
  try {
    const { sectionId, courseId } = req.body;

    await Course.findByIdAndUpdate(courseId, {
      $pull: {
        courseContent: sectionId,
      },
    });

    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    await SubSection.deleteMany({ _id: { $in: section.subSection } });
    await Section.findByIdAndDelete(sectionId);

    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "Section deleted",
      data: course,
    });
  } catch (error) {
    console.log("Error while deleting section", error);
    return res.status(500).json({
      success: false,
      message: "Unable to delete Section, please try again",
      error: error.message,
    });
  }
};
