const express = require("express");
const router = express.Router(); 
const controller = require("./../Controller/teacherController");
const validateMW = require("./../Core/validations/validateMW");
const teacherValidation = require("./../Core/validations/teacherValidation");
const { isAdmin } = require("../Core/authenticationMW");

router
  .route("/teachers")
  .get(
    isAdmin,
     controller.getAllteachers)
  .post(teacherValidation.add, validateMW, controller.addteacher)

  router.route("/teachers/supervisors")
  .get(controller.getAllsupervisors)

router.route("/teachers/:id")
  .get(controller.getTeacherById)
  .patch(teacherValidation.update, validateMW, controller.updateteacher)
  .delete(teacherValidation.delete, validateMW, controller.deleteteacher);

  router.route("/changepassword")
  .patch(controller.changepassword)

module.exports = router;


