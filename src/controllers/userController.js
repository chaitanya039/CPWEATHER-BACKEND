const User = require("../Models/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const shortid = require("shortid");
const formidable = require("formidable");
const path = require("path");
const fs = require("fs");
const {  v4: uuidv4 } = require("uuid");
const Contact = require("../Models/contactSchema");

const generateJwtToken = (user) =>{
    return jwt.sign({ user }, process.env.SECRET_KEY, { expiresIn: "7d" });
}

exports.register = async (req, res)=>{
    try {
        // Finding the existing profile of user
        const isEmailFound = await User.findOne({ email: req.body.email });
        const isPhoneFound = await User.findOne({ contactNumber: req.body.contactNumber });
        console.log(isPhoneFound);        
        // If user with email exists
        if (isEmailFound) {
            return res.status(400).json({ errors : [
                {
                    msg : "User already exists with this email !"
                }
            ]});
        }
        
        // If user with email exists
        if (isPhoneFound) {
            return res.status(400).json({ errors : [
                {
                    msg : "User already exists with this contact no !"
                }
            ]});
        }

        // if user profile is not exists
        // then take all fields form request body object
        const {
            firstName,
            lastName,
            email,
            password,
            contactNumber
        } = req.body;

        // hash password using bcrypt
        const hash_password = await bcrypt.hash(password, 10);

        const newUserProfile = new User({
            // firstName : firstName  key and value are same therefore use ===>
            firstName,
            lastName,
            email,
            hash_password,
            contactNumber,
            profilePicture : "https://res.cloudinary.com/doj90b0q7/image/upload/v1688382501/CPWEATHER/profile.png",
            userName : shortid.generate()
        });

        await newUserProfile.save(function (error, user) {
            if (error) { 
                return res.status(400).send(error).json({
                    message: "something went wrong.."
                });
            } 
            if(user){
                const { _id, firstName, lastName, email, fullName, contactNumber, profilePicture } = user;
                const token = generateJwtToken({ _id, firstName, lastName, email, fullName, contactNumber, profilePicture });

                return res.status(201).json({
                    token,
                    user: { _id, firstName, lastName, email, fullName, contactNumber, profilePicture },
                    message: "User Created Successfully"
                });
            }
        });
    } catch (error) {
        res.status(400).send("error");
    }
    
}


exports.login = async (req, res)=>{
    try {
        
        // finding the user profile
        const userProfile = await User.findOne({ email: req.body.email });
        
        // if found then logged in
        if (userProfile) {
            const isPassword = await userProfile.authenticate(req.body.password); 
            // Authenticating the user password by using the instance method of documents..
            if ( isPassword) 
            {
                
                const {
                    _id,
                    firstName,
                    lastName,
                    email,
                    fullName,
                    profilePicture,
                    contactNumber
                } = userProfile;
                
                // generating the jwt token
                const token = generateJwtToken({ _id, firstName, lastName, email, fullName, contactNumber, profilePicture });
                
                res.cookie('token', token , { expiresIn: "7d" });

                res.status(200).json({
                    token, 
                    user: {
                        _id,
                        firstName,
                        lastName,
                        email,
                        fullName,
                        contactNumber,
                        profilePicture
                    },
                    message: "User login successfully"
                });
            }

            else
            {
                // Password is wrong !
                return res.status(401).json({ errors : [
                    {
                        msg : "Invalid User details"
                    }
                ] });
            }

            
        }

        else
        {
            // Even not get the email in database !
            return res.status(401).json({ errors : [
                {
                    msg : "Invalid User details"
                }
            ] });
        }
    } catch (error) {
        res.status(500).json(error.message);
    }
};

exports.contact = async (req, res) => {
    const form = formidable({ multiples : true });
    form.parse(req, async (error, fields, files) => {
        const { firstName, lastName, email, message } = fields;
        let isAttachment = false;
        if(Object.keys(files).length !== 0)
        {
            isAttachment = true;
            const type = files.attachment.mimetype;
            const split = type.split("/");
            const extension = split[1];
            files.attachment.newFilename = uuidv4() + "." + extension;
            const newPath = path.join(__dirname , `../../../client/src/uploads/${files.attachment.newFilename}`);
            fs.copyFile(files.attachment.filepath, newPath, async (error) => {
               if(error)
               {
                console.log(error);
                  return res.status(400).json({ error, msg : "Failed to upload the attachment !" });
               }
            })
        }
        try
        {
            const response = await Contact.create({
                firstName,
                lastName,
                email,
                message,
                attachment : isAttachment ? files.attachment.newFilename : ""
            });
            
            return res.status(201).json({ msg : "Contact form submitted successfully !", response });
        }
        catch(error)
        {
            return res.status(500).json({ errors : error, msg : error.message })
        }
    })
}

// exports.logout = async (req, res)=>{
//     res.clearCookie("token");
//     res.status(200).json({
//         message: "Logout Successfully...!!"
//     })
// };