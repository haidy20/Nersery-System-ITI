const { body, param, query } = require("express-validator");

exports.add= [
    body("name").isString().withMessage("Name must be string"),
    body("supervisor").isMongoId().withMessage("supervisor must be object id"),
    body("children").isArray().withMessage("children must be array"),
    body("children.*").isNumeric().withMessage("children must be array of ids"),
];

exports.update = [
    param("id").isInt().withMessage("Id Shoud be Int"),
    body("name").optional().isString().withMessage("Name must be string"),
    body("supervisor").optional().isMongoId().withMessage("supervisor must be object id"),
    body("children").optional().isArray().withMessage("children must be array of ids"),
    body("children.*").optional().isNumeric().withMessage("children must be array of ids"),
];

exports.delete = [
    param("id").isInt().withMessage("Id Shoud be Int")
]