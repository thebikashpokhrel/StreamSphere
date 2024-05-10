import mongoose from "mongoose";
import jwt from "jwt";
import bcrypt from "bcrypt";
const userSchema=new Schema({
    username:{
        type: 'string',
        required: true,
        unique: true,
        lowercase: true,
        trim:true,
        index:true
    },
    email:
    {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim:true,

    },
    fullname:
    {
        type: String,
        required: true,
        index:true,
        trim:true,
    },
    avatar:
    {
        type:String, //cloudinary url
        required:true,
    },
     coverImage:
    {
        type:String, //cloudinary url
    },
    watchHistory:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Video"
    }
],
     password:
     {
        type:String,
        required:[true,"password is required"],

     },
     refreshToken:
     {
        type:true,

     }



},{timestamps:true});

// adding middleware before saving the password in database by hashing
userSchema.pre("save", async function(next){
    if (!this.isModified("password")) return next();

    this.password=bcrypt.hash(this.password,8);
    next();


})

//checking the password validation using custom methods
userSchema.methods.isPasswordCorrect=async function(password)
{
    return await bcrypt.compare(password,this.password)
    //return boolean value 
}

userSchema.methods.generateAccessToken= function(){
    return jwt.sign(
        {
            _id:this._d,
            email:this.email,
            username:this.username,
            fullname:this.fullname,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY

        }
    )
    
}

userSchema.methods.generateRefreshToken= function(){
    return jwt.sign(
        {
            _id:this._d,
            
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_SECRET

        })
}


export const user= Schema.model("user",userSchema);