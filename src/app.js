const dotenv = require("dotenv");
const crypto = require('crypto');
const express = require('express');
require('../src/db/conn');
const path = require('path');
const hbs = require('hbs');
const bcrypt = require("bcryptjs");
const sendEmail = require('../src/email');
// const nademailer = require('nodemailer');

const PORT = 3000;

const Registration = require('../src/register'); 



const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
const static_path = path.join(__dirname,'../public');
const templates_path = path.join(__dirname,'templates/views');
const partials_path = path.join(__dirname,'templates/partials');

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views",templates_path);
hbs.registerPartials(partials_path);

app.get('/',(req,res) =>{
    res.render("index");
})

app.get('/registration',(req,res) => {
    res.render("register")
})

app.post('/registration',async (req,res) => {
    try{
        const Password = req.body.Password;
        const CPassword = req.body.ConfirmPassword;

        if(Password === CPassword){
            const registerd = new Registration({
                firstName : req.body.firstName,
                lastName : req.body.lastName,
                Email : req.body.Email,
                Enter_age : req.body.Enter_age,
                phoneNumber : req.body.phoneNumber,
                Password : req.body.Password,
                ConfirmPassword : req.body.ConfirmPassword,

            })



            const registeering = await registerd.save();
            res.status(200).render("index");
        }
        else{
            res.render("passwordnotmatch")
        }
    }
    catch(error){
        res.status(400).send(error);
    }
})




app.get('/login',(req,res) => {
    res.render("login")
})

app.post('/login',async(req,res) => {
    
    try{
        const email = req.body.email;
        const password = req.body.password;

       const useremail = await Registration.findOne({Email: email});
        // console.log(`${useremail.Password}`);
       const isMatch = await bcrypt.compare(password,useremail.Password);
       
       if(isMatch){
           res.status(200).render("index")
       }
       else{
           res.status(400).send("Password are not matching....")
       }

        
    }
    catch(error){
        res.status(400).send("invalid email")
    }
})


// const bcrypt = require("bcryptjs");
// const securePassword = async (password) => {
//     const passhash = await bcrypt.hash(password,10);
//     const passcompare = await bcrypt.compare("hunny",passhash);
//     console.log(passcompare);
// }


// securePassword("hunny");

app.get('/forget',(req,res) => {
    res.status(200).render("forget")
})

app.post('/forget',async (req,res,next) => {
    const EmailAddr = req.body.email;
    const user = await Registration.findOne({Email:req.body.email});
    if(!user){
        res.status(400).send("There is no user with this email")
    }

    const resetToken = user.CreatePasswordResetToken();

    await user.save({validateBeforeSave: false});

    const resetURL = `${resetToken}`;

    const message = `Forgot your password? ${resetURL}`;
    // const message = `Forgot your password? `;
    try{
           sendEmail({
            email: user.Email,
            subject:'your password reset token vlid for just 10 min.',
            message
            })
    
            res.status(200).json({
            status:'success',
            message:'Token sent to email!'
        })
    }catch(error){
        user.PasswordResetToken = undefined;
        user.PasswordResetExpires = undefined;
        await user.save({validateBeforeSave: false});

        // res.status(400).send("Error try again Later!")
        res.status(400).send(`${message}`)
    }
    
})

app.patch('/resetpassword/:token',async (req,res) => {
    // 1)Get user based on Token
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await Registration.findOne({PasswordResetToken:hashedToken,PasswordResetExpires : {$gt: Date.now()}});
})

app.get('/contact',(req,res) => {
    res.status(200).render("contact");
})


// app.post('/contact',(req,res) => {
//     const name = req.body.name;
//     const email = req.body.email;
// })
// console.log("==========================================================");
// console.log('../config.env');
// console.log("=============================================================");

// const dotenv = require('dotenv');
// console.log("=====================");
// dotenv.config({path: '../src/config.env'});
// require('./../src/.env')
require('dotenv').config();

// console.log("=====================");
// console.log(process.env);
app.listen(process.env.PORT,(req,res) => {
    console.log(`App is running on PORT ${process.env.PORT}....`);
})