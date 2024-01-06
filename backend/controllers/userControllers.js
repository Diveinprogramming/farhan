const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const randomstring = require("randomstring");
const sendToken = require('../utils/sendToken');

const userModel = require('../models/userModel');
const generateToken = require('../utils/genrateToken');



const signUp = async (req, res) => {
    const { email, password, userType} = req.body;

    //Checking if all fields exist in request
    if(!email  || !password  || !userType ){
        res.status(400).json({ "status":"fail", "message":"Empty Credentials" })
    }

    //Checking if User already exists
    const userExists = await userModel.findOne({email});
    if(userExists){
        res.status(400).json({ "status":"fail", "message":"User already Registered" })
    }
    else{
        //Creating Account in Database
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const user = await userModel.create({
            password: hashedPassword,
            email, 
            userType 
        });
    
        //Conditional Response
        if(user){
            res.status(201).json({
                "status" : "success",
                token: generateToken(user._id)
            })
        }
        else{
            res.status(400).json({ "status":"fail", "message":"Invalid User Data" })
        }
    }
}

const login = async (req, res) => {
    const {email, password} = req.body

    if(!email || !password){
        res.status(400).json({ "status":"fail", "message":"Empty Credentials" })
    }
    else{
        const user = await userModel.findOne({email}).select('_id email password')
    
        if(!user){
            res.status(400).json({ "status":"fail", "message":"User doesn't Exist" })
        }
        else{
            if(await bcrypt.compare(password, user.password)){
                res.status(201).json({
                    "status" : "success",
                    token: generateToken(user._id)
                })
            }
            else{
                res.status(400).json({ "status":"fail", "message":"Invalid Credentials" })
            }
        }
    }
}

const forgetPass = async (req, res) => {
    const {email} = req.body;
    if(!email){
        res.status(400).json({ "status":"fail", "message":"Please add Email" });
    }
    const user = await userModel.findOne({email});
    if(!user){
        res.status(400).json({ "status":"fail", "message":"Invalid Email" });
    }
    else{
        const newToken = randomstring.generate({
            length: 6,
            charset: 'numeric'
        });
        const tokenAdded = await userModel.findOneAndUpdate(
            { email }, 
            { token: newToken }
        );
        if(tokenAdded){
            await sendToken(email, 'Forgot Password', 
            'Use this OTP for password reset: '+ newToken);
            res.status(200).json({ "status":"success", "message":"OTP send to "+ email });
        }
        else{
            res.status(200).json({ "status":"fail", "message":"OTP not sent, contact iT support" });
        }
    }
}

const validateOTP = async (req, res) => {
    const {email , password , OTP} = req.body;
    if(!email){
        res.status(400).json({ "status":"fail", "message":"Please add Email" })
    }
    if(!password){
        res.status(400).json({ "status":"fail", "message":"Please add Password" })
    }
    if(!OTP){
        res.status(400).json({ "status":"fail", "message":"Please add OTP" })
    }
    const user = await userModel.findOne( { email })
    if(!user){
        res.status(400).json({ "status":"fail", "message":"Invalid Email" })
    }
    else{
        if(user.token == OTP){
            
            const salt = await bcrypt.genSalt(10)
            const hashedNew = await bcrypt.hash(password, salt)
            const newUser = await userModel.findOneAndUpdate( {email}, {password: hashedNew});
            await userModel.findOneAndUpdate( {email}, {token:"384599"} );
            res.status(200).json({ "status":"success", "message":"Password Changed Succesfully" })
        }
        else{
            res.status(400).json({ "status":"fail", "message":"Invalid OTP" })
        }
    }
}

const getData = async( req , res)=>{
    const users = await userModel.find();
    console.log(users);
    res.status(201).json(users);
}

 module.exports = {
    signUp,
    login,
    forgetPass,
    validateOTP,
    getData
 }

