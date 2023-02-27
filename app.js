const express = require('express')
const cors = require('cors')
const app = express();
let PORT = 4000;


const mongoose = require('mongoose')
mongoose.set('strictQuery', false)


// require database model
const User = require('./models/user')

// middleware
app.use(express.json()) //cross origin resourse sharing
app.use(express.urlencoded({ extended: false }))
app.use(cors())

const dbURL = "mongodb://localhost:27017/fodiee"
mongoose.connect(dbURL).then(() => {
    console.log("connected successfullady to database");
})

app.post('/signup', async (req, res) => {
    User.findOne({ email: req.body.email }, (err, UserData) => {
        if (UserData) {
            res.send({ message: "seems like you have already an account" })
        } else {
            const data = new User({
                name: req.body.name,
                email: req.body.email,
                phonenumber:req.body.phonenumber,
                password: req.body.password
            })
           data.save(()=>{
            if(err){
                res.send(err)
            }else{
                res.send({message:"user register succefully"})
            }
           })
        }
    })
  
})
app.listen(PORT, () => {
    console.log(`listening to the port ${PORT}`);
})