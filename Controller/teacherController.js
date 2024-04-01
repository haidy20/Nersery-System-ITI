const mongoose=require("mongoose");
const teachreSchema=require("./../Model/teacherModel"); 
const classSchema=require("./../Model/classModel");
const bcrypt = require('bcrypt');
const fs = require('fs');
// const path= require("path");


// const saltRounds = 10;
// /////////////////////////////////////

/**
 * @swagger
 * /teachers:
 *   get:
 *     summary: Get all teachers
 *     tags:
 *       - teachers
 *     security:
 *       - bearerAuth: [http, Bearer]  # This indicates that the endpoint requires a bearer token for authentication
 *     responses:
 *       '200':
 *         description: List of all teachers
 *       '401':
 *         description: Unauthorized - Authentication credentials were missing or invalid
 *       '500':
 *         description: Error occurred
 */

exports.getAllteachers=(request,response)=>{
    teachreSchema.find({})
                .then((data)=>{
                    response.status(200).json({data});        
                })
                .catch((error)=>{
                    next(error);
                }) 
}

///////////////////////////////////////////////////////// 

/**
 * @swagger
 * /teachers/{id}:
 *   get:
 *     summary: Get teacher by ID
 *     tags:
 *       - teachers
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Teacher ID
 *     security:
 *       - bearerAuth: [http, Bearer]
 *     responses:
 *       '200':
 *         description: Teacher found
 *       '404':
 *         description: Teacher not found
 *       '500':
 *         description: Error occurred
 */

exports.getTeacherById = (req, res, next) => {
    teachreSchema.findOne({_id:req.params.id})
        .then((teachers) => {
            if (!teachers) {
                return res.status(404).json({ message: "Teacher not found" });
            }
            res.status(200).json({ teachers });
        })
        .catch((error) => next(error));
  };  

// //////////////////////////////////////////////////

/**
 * @swagger
 * /teachers:
 *   post:
 *     summary: Insert a new teacher
 *     tags:
 *       - teachers
 *     security:
 *       - bearerAuth: [http, Bearer]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '200':
 *         description: Teacher inserted successfully
 *       '500':
 *         description: Error occurred
 */

// bcrypt password & insert image
  exports.addteacher = async (req, res, next) => {
    const { fullName, email, password, role } = req.body;
    const image = req.file.filename; 
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10); 
  
      // Create a new teacher object with hashed password
      const newTeacher = new teachreSchema({
        fullName: fullName,
        email: email,
        password: hashedPassword,
        image: image, // Store the filename of the image
        role: role
      });
  
      // Save the new teacher to the database
      await newTeacher.save();
  
      res.status(200).json({ message: 'Teacher inserted successfully' });
    } catch (error) {
      next(error); // Pass any errors to the error handling middleware
    }
  };

  // ///////////////////////
  //   exports.updateteacher = (req, res, next) => {
  //     const id = req.params.id;
  //     teachreSchema.findByIdAndUpdate(id,req.body,{ new: true }) 
  //     .then((teacher) => {
  //         if (!teacher) {
  //             return res.status(404).json({ message: "Teacher not found" });
  //         }
  //         res.status(200).json({ teacher });
  //     })
  //     .catch((error) => next(error));
  // }


//////////////////////////////////////////////////////
/**
 * @swagger
 * /teachers/{id}:
 *   patch:
 *     summary: Update a teacher
 *     description: Update details of an existing teacher. Allows updating of full name, email, password, and profile image.
 *     tags:
 *       - teachers
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         type: string
 *         description: The ID of the teacher to update.
 *     security:
 *       - bearerAuth: [http, Bearer]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: The updated full name of the teacher.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: The updated email address of the teacher.
 *               password:
 *                 type: string
 *                 description: The updated password of the teacher. (Optional)
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: The updated profile image of the teacher. (Optional)
 *     responses:
 *       '200':
 *         description: Teacher updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message confirming the update.
 *       '404':
 *         description: Teacher not found.
 *       '500':
 *         description: Internal server error.
 */

exports.updateteacher = async (req, res, next) => {
  // return res.status(200).json({
  //   Body:req.body ,
  //   File: req.file 
  //   })
  const id = req.body._id;
  const newData = req.body;
  let imageUrl = '';

   console.log(req.file.originalname);
  // Check if a new image file is uploaded
  if (req.file) {
      imageUrl = req.file.originalname;
      newData.Image = imageUrl; // Update the Image field in the newData object
  }
  // Check if there's an existing image and delete it if new image is uploaded
  
  try {
      // Find the teacher by ID
      let updateteacher = await teachreSchema.findById(id);

      if (!updateteacher) {
          return res.status(404).json({ message: 'Teacher not found' });
      }
      
      if (updateteacher.Image && imageUrl !== updateteacher.Image) {
        fs.unlinkSync(updateteacher.Image); // Delete the old image file
    }
    

      // If a new password is provided, hash it and update
      if (newData.password) {
          const hashedPassword = await bcrypt.hash(newData.password, 10);
          newData.password = hashedPassword;
      }
      
    
      // Update the teacher object with the new data
      Object.assign(updateteacher, newData);

      // Save the updated teacher to the database
      updateteacher = await updateteacher.save();

      res.status(200).json({ message: 'Teacher updated successfully', data: newData });
  } catch (error) {
      next(error);
  }
};
  // //////////////////////////////////////////////
 /**
 * @swagger
 * /teachers/{id}:
 *   delete:
 *     summary: Delete a teacher by ID
 *     tags: [teachers]
 *     security:
 *       - bearerAuth: [http, Bearer]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the teacher to delete
 *     responses:
 *       '200':
 *         description: Teacher deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the success of the deletion operation
 *       '404':
 *         description: Teacher not found
 *       '500':
 *         description: Internal server error
 */

  exports.deleteteacher= (req, res, next) => {
    const teacherId = req.params.id;
    teachreSchema.deleteOne({ _id: teacherId })
        .then((result) => {
            if (result.deletedCount === 0) {
                console.log(`Teacher with id ${teacherId} not found`);
                return res.status(404).json({ message: "Teacher not found" });
            }
            res.status(200).json({ message: "Teacher deleted successfully" });
        })
        .catch((error) => {
            console.error("Error deleting teacher:", error);
            next(error);
        });
};

///////////////////////////////////////////

/**
 * @swagger
 * /teachers/supervisors:
 *   get:
 *     summary: Get all supervisors
 *     description: Retrieve information about all supervisors.
 *     tags:
 *       - Supervisors
 *     responses:
 *       '200':
 *         description: Successfully retrieved information about supervisors.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 supervisors:
 *                   type: array
 *       '500':
 *         description: Internal server error.
 */
exports.getAllsupervisors = (req, res, next) => {
  classSchema.find({})
    .populate({
      path: 'supervisor', // Update to match the field name in your classSchema
      select: { fullName: 1 },
      model: 'teachers' // Make sure this matches your teachers model name
    })
    .then(data => {
      let supervisors = data.map(item => item.supervisor);
      res.status(200).json({ supervisors });
    })
    .catch(err => next(err));
}


 /////////////////////////////////////////

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT 
 * 
 */


 /**
 * @swagger
 * /changepassword:
 *   patch:
 *     summary: Change password for a teacher
 *     tags: [teachers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 type: string
 *                 description: The ID of the teacher whose password needs to be changed
 *               password:
 *                 type: string
 *                 description: The new password for the teacher
 *     responses:
 *       '200':
 *         description: Password changed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message indicating the success of the password change operation
 *       '404':
 *         description: Teacher not found
 *       '500':
 *         description: Internal server error
 */
//  Change password of the teacher

exports.changepassword = async (req, res, next) =>{
  const { password, _id } = req.body; // Extract password and _id from req.body
  try {
      let teacher = await teachreSchema.findById(_id);
      if (!teacher) {
          return res.status(404).json({ message: "Teacher whom you want to change their password is not found" });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
      teacher.password = hashedPassword;
      await teacher.save();
      res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
      next(error);
  }
}