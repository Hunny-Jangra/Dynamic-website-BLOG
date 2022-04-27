const mongoose = require('mongoose');

mongoose.connect("mongodb+srv://Project_registration:123-Apple-$$$@cluster0.anox0.mongodb.net/FinalProjectRegistration?retryWrites=true&w=majority",{
    useNewUrlParser:true
}).then(
    ()=>{
        console.log(`Connected successfully...`);
    }
)