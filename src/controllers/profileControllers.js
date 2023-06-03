const User = require("../Models/userSchema");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const formidable = require("formidable");
const { v4: uuidv4 } = require('uuid');
const fs = require("fs");
const path = require("path");

module.exports.updateName = async (req, res) => {
    let { firstName, lastName, id } = req.body;
    console.log(firstName + "  " + lastName);
    if(firstName === "")
    {
        return res.status(400).json({ errors : [{ msg : "Firstname is required !" }] });
    }
    if(lastName === "")
    {
        return res.status(400).json({ errors : [{ msg : "Lastname is required !" }] });
    }
    else
    {
        try
        {
            const user = await User.findByIdAndUpdate(id, { firstName : firstName, lastName : lastName}, { new : true });
            const token = jwt.sign({ user }, process.env.SECRET_KEY, { expiresIn: "7d" });
            
            return res.status(200).json({ token, msg : "Your name has been updated !" });
        }
        catch(error)
        {
           console.log(error);
        }
    }
}

module.exports.updatePasswordValidations = [
    body('currentPassword').notEmpty().trim().withMessage("Current password is required !"),
    body('newPassword').notEmpty().withMessage("New password should be atleast 6 characters long !").isLength({ min: 6 }),
 ]

module.exports.updatePassword = async (req, res) => 
{
    const { currentPassword, newPassword, userId } = req.body;
    const errors = validationResult(req);
    
    if(newPassword.length < 6)
    {
        return res.status(400).json({ errors : [{ msg : "New password should 6 characters long !" }] });
    }
    if(!errors.isEmpty)
    {
        return res.status(400).json({ errors : errors.array() })
    }
    else
    {
        try
        {
            const user = await User.findOne({ _id : userId });
            if(user)
            {
                const matched = await user.authenticate(currentPassword);
                if(!matched)
                {
                    return res.status(400).json({ errors : [{ msg : "Current password is wrong !" }] });
                }
                else
                {
                    const hash_password = await bcrypt.hash(newPassword, 10);
                    const newUser = await User.findOneAndUpdate({ _id : userId }, { hash_password : hash_password }, { new : true });
                    return res.status(200).json({ msg : "Password has been changed successfully !" });
                }
            }
        }
        catch(error)
        {
            console.log(error);
            return res.status(500).json({ error });
        }
    }
}

module.exports.updateProfilePicture = async (req, res) =>
{
    const form = formidable({ multiples : true });
    form.parse(req, (error, fields, files) => {
        const errors = [];
        const type = files.image.mimetype;
        const split = type.split("/");
        const extension = split[1];
        
        if(extension !== "jpg" && extension !== "jpeg" && extension !== "png")
        {
            errors.push({ msg : `.${extension} is not a valid extension !` });
        }
        else
        {
           // We have image with proper extension
           // If name of the image is duplicate then there will be problem use uuid to generate random number
           files.image.newFilename = uuidv4() + "." + extension;
        }
        // Now Check Errors
        if(errors.length !== 0)
        {
           return res.status(400).json({ errors });
        }
        else
         {
            let newPath;
            if(process.env.STATUS === "production")
            {
                newPath = path.join(__dirname , `https://cpweather.netlify.app/src/uploads/${files.image.newFilename}`);
            }
            else
            {
                newPath = path.join(__dirname , `../../../client/src/uploads/${files.image.newFilename}`);
            }
            
            fs.copyFile(files.image.filepath, newPath, async (error) => {
                if(!error)
                {
                  try
                  {
                    const user = await User.findOneAndUpdate({_id : fields.userId}, { profilePicture : files.image.newFilename }, { new : true });
                    const token = jwt.sign({ user }, process.env.SECRET_KEY, { expiresIn: "7d" });
                    return res.status(200).json({ token, msg : "Your profile picture has been changed !" });
                  }
                  catch(error)
                  {
                     return res.status(500).json({ errors : error, msg : error.message })
                  }
                }
            });
         }
    });
}