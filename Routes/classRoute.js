const express = require("express");
const router = express.Router();
const controller = require("./../Controller/classController");
const validateMW = require("./../Core/validations/validateMW");
const classValidation = require("../Core/validations/classValidation");

router
    .route("/classes")
    .get(controller.getAllClasses)
    .post(classValidation.add,validateMW,controller.addClass)

    router.route("/classes/teachers/:id")
    .get(controller.getSupervisorInfo);
     
 router.route("/classes/:id")
    .get(controller.getClassById)
    .delete(classValidation.delete, validateMW, controller.deleteClass)
    .patch(classValidation.update,validateMW,controller.updateClass)
 router.route("/classes/childern/:id")
    .get(controller.getChildInfo);
  

module.exports = router;