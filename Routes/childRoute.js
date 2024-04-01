const express = require("express");
const router = express.Router();
const controller = require("../Controller/childController");
const validateMW = require("../Core/validations/validateMW");
const childValidation = require("../Core/validations/childValidation");

router.route("/childern")
    .get(controller.getAllChildern)
    .post(childValidation.add,validateMW,controller.addChild)

router.route("/childern/:id")
.get(controller.getChildById)
.delete(childValidation.delete, validateMW, controller.deleteChild) 
.patch(childValidation.update, validateMW, controller.updateChild)


module.exports = router;
