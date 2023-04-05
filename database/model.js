const mongoose=require('mongoose');
const { Schema } = mongoose;
const jwt=require('jsonwebtoken')

mongoose.set('strictQuery',true)
const userSchema=new Schema({
    email:{type:String,required:true},
    userName:{type:String,required:true},
    password:{type:String,required:true},
    cPassword:String,
    userType:String,
    tokens:[{
        token:String,
    }]
})
const blogSchema = new Schema({
    title:{type:String,required:true},
    content:{type:String,required:true},
    userName:{type:String,required:true},
    email:{type:String,required:true},
    blogId:{type:String,required:true},
    comments:[{user:String,comment:String}]
})


userSchema.methods.generateAuthToken = async function(){
    try {
        let token=jwt.sign({_id:this.id},process.env.secretKeyCookie)
        this.tokens=this.tokens.concat({token:token})
        await this.save()
        return token	
    } catch (error) {
        console.log(error)
    }
}
const user=mongoose.model('user',userSchema)
const blogs=mongoose.model('blog',blogSchema)

module.exports= {blogs,user};
