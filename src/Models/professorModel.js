const mongoose = require("mongoose")
const validator=require("validator")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")


const ProfessorSchema = mongoose.Schema({
    professorName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique: true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid!")
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
            
    },
    tokens:[
       {
           token:{
               type:String,
               required:false
           }
       }
    ]
})



//Professordef function for gen auth token
ProfessorSchema.methods.genAuthToken = async function(){
    const user = this
    const token = jwt.sign({_id:user._id.toString()},"thisisseceret",{ expiresIn:"7 days"})
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}

//Professordef function for authentication
ProfessorSchema.statics.findByCredentials = async (email,password) => {
    const user = await Professor.findOne({ email })
   // console.log(user, email)
    if(!user){
        throw new Error("Email is incorrect")
    }
    const isMatched = await bcrypt.compare(password,user.password)
    if(!isMatched){
        throw new Error("password is incorrect")
    } else{
        return user
    }
}

//Professordef function for authentication
ProfessorSchema.statics.findByEmail = async (email) => {
    // console.log("erwe")
    const user = await Professor.findOne({ email })
    // console.log(Professor,"Professor")
    if(!user){
        throw new Error("unable to find")
    }
    return user
}

//Professordef function for authentication
ProfessorSchema.statics.findProfessorById = async (id) => {
    console.log("reached schemma")
    const user = await Professor.findById({_id : id})
    // console.log(Professor,"Professor")
    if(!user){
        throw new Error("unable to find")
    }
    return user
}

//using mongoose middleware for hashing passwords
ProfessorSchema.pre("save",async function (next) {
    const user = this
    console.log("Professor data received")
   if(user.isModified('password')){
       user.password=await bcrypt.hash(user.password,8)
   }
    next()
})

//creating a Professor model
const Professor = mongoose.model('Professor',ProfessorSchema)

module.exports=Professor