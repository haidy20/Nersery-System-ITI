const jwt = require("jsonwebtoken");
const teachreSchema = require("../Model/teacherModel");
const bcrypt = require('bcrypt');

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Authenticate user
 *     tags:
 *       - Authentication
 *     requestBody:
 *       description: User credentials for authentication
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: The full name of the user.
 *               password:
 *                 type: string
 *                 description: The user's password.
 *     responses:
 *       '200':
 *         description: Successfully authenticated. Returns JWT token.
 *       '401':
 *         description: Authentication failed.
 */

exports.login = async (req, res, next) => {
    try {
        // Find the user by their full name
        const user = await teachreSchema.findOne({ fullName: req.body.fullName });

        if (!user) {
            throw new Error("User not found");
        }

        // Compare the provided password with the hashed password stored in the database
        const match = await bcrypt.compare(req.body.password, user.password);

        if (match) {
            // Passwords match, generate JWT token
            const token = jwt.sign(
                {
                    _id: user._id,
                    role: user.role,
                },
                process.env.SECRET_KEY,
                { expiresIn: "24hr" }
            );

            res.json({ message: "Authenticated", token });
        } else {
            
            res.json({ message: "not Authenticated" });
        }
    } catch (error) {
        
        console.error("Login error:", error);
        res.status(401).json({ message: "Authentication failed" });
    }
};
