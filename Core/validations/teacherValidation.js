const { body, param, query } = require("express-validator");

exports.add = [
    body("fullName").isString().withMessage("Full Name must be string"),
    body('password').isLength({ min: 2 }).withMessage("teacher password min length 8"),
    body("email").isEmail().withMessage("Email Invalid Format"),
    // body("image").isString().withMessage("image Invalid Must be String"),
];

exports.update =[
    param("id")
      .isMongoId()
      .withMessage("teacher id required and should be object ID"),
    body("fullName")
      .optional()
      .isString()
      .withMessage("teacher username should be string")
      .isLength({ min: 4 })
      .withMessage(" teacher userName lenght > 4"),
    body('password')
      .optional()
      .isLength({ min: 4 })
      .withMessage("teacher password min length 4"),
  
    body('email')
      .optional()
      .isEmail()
      .withMessage("teacher email is invalid"),
  
      // body('image')
      // .optional()
      // .isString()
      // .withMessage("teacher image should be string"),
  ];
  

exports.delete = [
    param("id").isMongoId().withMessage("Id Shoud be Object id"),
]
