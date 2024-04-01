const { body, param, query } = require("express-validator");

exports.add = [
    body("fullName")
        .isString()
        .withMessage("fullName should be string")
        .isLength({ max: 15 })
        .withMessage("child name < 10"),
    body("level")
        .isIn(["PREKG", "KG1", "KG2"])
        .withMessage("You should select one of existed levels"),
    body("age")
        .isInt({min:0})
        .withMessage("Age should be Int and non-negative"),
    body("address.city").isString().withMessage("city should be string"),
    body("address.street").isString().withMessage("street should be string"),
    body("address.building").isNumeric().withMessage("bulding should be number")

];

exports.update = [
    param("id")
        .optional()
        .isInt()
        .withMessage("child Id should be integer"),
    body("fullName")
        .optional()
        .isString()
        .withMessage("fullName should be string")
        .isLength({ max: 30 })
        .withMessage("child name <10"),
    body("level")
        .optional()
        .isIn(["PREKG", "KG1", "KG2"])
        .withMessage("You should select one of existed levels"),
    body("age")
        .optional()
        .isInt()
        .withMessage("Age should be Number"),
    body("address.city").optional().isString().withMessage("Invalid city"),
    body("address.street").optional().isString().withMessage("Invalid street"),
    body("address.building").optional().isNumeric().withMessage("Invalid bulding")
    


];

exports.delete = [
    param("id").isInt().withMessage("Id Shoud be Int"),
]