const jwt = require("jsonwebtoken");
const teachreSchema = require("../Model/teacherModel");

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticate a teacher
 *     description: Returns a JWT token upon successful authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid full name or password
 */
exports.login = (req, res, next) => {
    teachreSchema.findOne({
        fullName: req.body.fullName,
        password: req.body.password
    })
        .then((teacher) => {
            if (!teacher) {
                throw new Error("Invalid full name or password");
            }
            const token = jwt.sign(
                { _id: teacher._id, role:"teachers"},
                "Nursery System",
                { expiresIn: "24h" }
            );
            res.status(200).json({ token });
        })
        .catch((error) => {
            res.status(401).json({ message: error.message });
        });
};

