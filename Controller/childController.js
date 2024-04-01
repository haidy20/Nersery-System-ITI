const mongoose = require("mongoose");

const childernSchema=require("./../Model/childModel");
const fs = require('fs');
// const path= require("path");
// /////////////////////////////////////////////

/**
 * @swagger
 * /childern:
 *   get:
 *     summary: Get all children
 *     description: Retrieve a list of all children.
 *     tags:
 *       - children
 *     security:
 *       - bearerAuth: [http, Bearer]  # Apply bearerAuth security scheme
 *     responses:
 *       '200':
 *         description: A list of children retrieved successfully.  
 *       '500':
 *         description: Internal server error.
 */

exports.getAllChildern=(request,response,next)=>{
    childernSchema.find()
    .then((data) =>{
        response.status(200).json(data);
    })
    .catch((error) => next(error));
}
// ///////////////////////////////////////////////////////////////

/**
 * @swagger
 * /childern/{id}:
 *   get:
 *     summary: Get teacher by ID
 *     tags:
 *       - childern
 *     security:
 *       - bearerAuth: [http, Bearer]  # Apply bearerAuth security scheme
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: childern ID
 *     responses:
 *       '200':
 *         description: childern found
 *       '404':
 *         description: childern not found
 *       '500':
 *         description: Error occurred
 */

exports.getChildById = (req, res, next) => {
    const childId = req.params.id;
    childernSchema.findById(childId)
        .then((childern) => {
            if (!childern) {
                return res.status(404).json({ message: "Child not found" });
            }
            res.status(200).json({ childern });
        })
        .catch((error) => next(error));
};
// ////////////////////////////////////////////////////
/**
 * @swagger
 * /childern:
 *   post:
 *     summary: Insert a new child
 *     tags:
 *       - childern
 *     security:
 *       - bearerAuth: [http, Bearer]  # Apply bearerAuth security scheme
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: fullName
 *         in: formData
 *         type: string
 *         description: The full name of the child.
 *       - name: age
 *         in: formData
 *         type: integer
 *         description: The age of the child.
 *       - name: level
 *         in: formData
 *         type: string
 *         description: The educational level of the child.
 *       - name: address.city
 *         in: formData
 *         type: string
 *         description: The city of the child's address.
 *       - name: address.street
 *         in: formData
 *         type: string
 *         description: The street of the child's address.
 *       - name: address.building
 *         in: formData
 *         type: integer
 *         description: The building number of the child's address.
 *       - name: image
 *         in: formData
 *         format: binary
 *         type: file
 *         description: The image file of the child.
 *     responses:
 *       '201':
 *         description: Child added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message confirming the child addition.
 *       '500':
 *         description: Error occurred
 */

exports.addChild=(request,response,next)=>{
    const { fullName, age, level, address } = request.body;
    const image = request.file.filename;

    const child = new childernSchema({
        fullName: fullName,
        age: age,
        level: level,
        address: address,
        image: image
    });

     child.save()
     .then(data=>{
         response.status(201).json({message:"added",data});
     })
     .catch(error => next(error))
}
// //////////////////////////////////////////////////////
/**
 * @swagger
 * /childern/{id}:
 *   patch:
 *     summary: Update a child
 *     description: Update details of an existing child. Allows updating of full name, age, level, address, and profile image.
 *     tags:
 *       - childern
 *     security:
 *       - bearerAuth: [http, Bearer]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the child to update.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 description: The updated full name of the child.
 *               age:
 *                 type: integer
 *                 description: The updated age of the child.
 *               level:
 *                 type: string
 *                 description: The updated educational level of the child.
 *               address:
 *                 type: object
 *                 properties:
 *                   city:
 *                     type: string
 *                     description: The updated city of the child's address.
 *                   street:
 *                     type: string
 *                     description: The updated street of the child's address.
 *                   building:
 *                     type: number
 *                     description: The updated building number of the child's address.
 *               image:
 *                 type: string
 *                 format: binary 
 *                 description: The updated profile image of the child.
 *     responses:
 *       '200':
 *         description: Child updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message confirming the update.
 *       '404':
 *         description: Child not found.
 *       '500':
 *         description: Internal server error.
 */

exports.updateChild = async (req, res, next) => {
    const id = req.body._id;
    const newData = req.body;
    let imageUrl = '';
     console.log(req.file.originalname);
    
    if (req.file) {
        imageUrl = req.file.originalname;
        newData.Image = imageUrl; 
    }
    
    try {
        let updateChild = await childernSchema.findById(id);
  
        if (!updateChild) {
            return res.status(404).json({ message: 'Child not found' });
        }
        
        if (updateChild.Image && imageUrl !== updateChild.Image) {
          fs.unlinkSync(updateChild.Image);
      }
        if (newData.password) {
            const hashedPassword = await bcrypt.hash(newData.password, 10);
            newData.password = hashedPassword;
        }
        
        Object.assign(updateChild, newData);
        updateChild = await updateChild.save();
  
        res.status(200).json({ message: 'Child updated successfully', data: newData });
    } catch (error) {
        next(error);
    }
  };
// /////////////////////////////////////////////////////////////

/**
 * @swagger
 * /childern/{id}:
 *   delete:
 *     summary: Delete a child
 *     description: Delete a child from the database.
 *     tags:
 *       - childern
 *     security:
 *       - bearerAuth: [http, Bearer]  # Apply bearerAuth security scheme
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the child to delete.
 *     responses:
 *       '200':
 *         description: Child deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A message confirming the deletion.
 *       '404':
 *         description: Child not found.
 *       '500':
 *         description: Internal server error.
 */

exports.deleteChild = (req, res, next) => {
    const childId = req.params.id;
    childernSchema.deleteOne({ _id: childId })
        .then((result) => {
            if (result.deletedCount === 0) {
                return res.status(404).json({  message: `Deleted class with id: ${childId}`});
            }
            res.status(200).json({ message: "Child deleted successfully" });
        })
        .catch((error) => next(error));
};
