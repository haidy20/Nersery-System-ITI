
const mongoose = require("mongoose");
const classSchema =require("./../Model/classModel");
const teacherSchema =require("./../Model/teacherModel");
const childSchema =require("./../Model/childModel");

exports.getAllClasses=(request,response,next)=>{
    classSchema.find()
    .then((data) => {
        response.status(200).json(data);
    })
    .catch((error) => next(error));
}
// ///////////////////////////////////////////////////////
exports.getClassById = (req, res, next) => {
    const classId = req.params.id;
    classSchema.findById(classId)
        .then((classes) => {
            if (!classes) {
                return res.status(404).json({ message: "Class not found" });
            }
            res.status(200).json({ data: classes });
        })
        .catch((error) => next(error));
};

// /////////////////////////////////////////////////////////////
exports.addClass = (req, res, next) => {
    const newClass = new classSchema(req.body);
    newClass.save()
        .then((classObj) => {
            res.status(200).json({ data: classObj });
        })
        .catch((error) => next(error));
};
// ///////////////////////////////////////////////////////////////
exports.updateClass = (req, res, next) => {
    const classId = req.params.id; // Ensure this value is correct
    // if (isNaN(classId)) { // Check if classId is not a number
    //     return res.status(400).json({ message: "Class ID should be an integer" });
    // }
    classSchema.findByIdAndUpdate(classId, req.body, { new: true })
        .then((classObj) => {
            if (!classObj) {
                return res.status(404).json({ message: "Class not found" });
            }
            res.status(200).json({ data: classObj });
        })
        .catch((error) => next(error));
};

// ///////////////////////////////////////////////////////////////////
exports.deleteClass = (req, res, next) => {
    const classId = req.params.id;
    classSchema.findByIdAndDelete(classId)
        .then((classObj) => {
            if (!classObj) {
                return res.status(404).json({ message: "Class not found" });
            }
            res.status(200).json({ message: `Deleted class with id: ${classId}` });
        })
        .catch((error) => next(error));
};

// ////////////////////////////////////////////////////
exports.getChildInfo = (req, res, next) => {
    const childId = req.params.id;
    try {
      if (!Number(childId)) {
        return res.status(400).json({ message: 'Invalid child ID' });
      }
      childSchema.findById(childId)
        .then((child) => {
          if (!child) {
            return res.status(404).json({ message: 'Child not found' });
          }
          classSchema.find({ student: childId })
            .then((classes) => {
              res.status(200).json({ child});
            })
            .catch((error) => next(error));
        })
        .catch((error) => next(error));
    } catch (error) {
      next(error);
    }
  };

////////////////////////////////////////////////////////////

  exports.getSupervisorInfo = (request, response, next) => {
    const teacherId = request.params.id;
    try {
      if (!mongoose.Types.ObjectId.isValid(teacherId)) {
        return response.status(400).json({ message: 'Invalid teacher ID' });
      }
      teacherSchema.findById(teacherId)
        .then((teacher) => {
          if (!teacher) {
            return response.status(404).json({ message: 'Teacher not found' });
          }
          classSchema.find({ teacher: teacherId })
            .then((classes) => {
              response.status(200).json({ teacher });
            })
            .catch((error) => next(error));
        })
        .catch((error) => next(error));
    } catch (error) {
      next(error);
    }
  };
  