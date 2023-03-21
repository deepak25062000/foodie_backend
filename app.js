
// !Import express model
const express = require('express')
const app = express();


// !Import mongoose model
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)


// ! Import CORS model
const cors = require('cors')


//! PORT NUMBER
let PORT = 4000;


//! require database model
const User = require('./models/user')
const Post = require('./models/posts')


//! middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())  //cross origin resourse sharing


// !Database Connection
const dbURL = "mongodb://localhost:27017/fodiee"
mongoose.connect(dbURL).then(() => {
    console.log("connected successfullady to database");
})


// ! Signin Sending to Server
app.post('/signin', async (req, res) => {
    User.findOne({ email: req.body.email }, (err, userData) => {
        if (userData) {
            if (req.body.password == userData.password) {
                res.send({ message: 'signin successfull' })
            } else {
                res.send({ message: 'signin failed' })
            }
        } else {
            res.send({ message: 'no account seems to be matching with your emial address' })
        }
    })
})


//! Signup to Server
app.post('/signup', async (req, res) => {
    User.findOne({ email: req.body.email }, (err, UserData) => {
        if (UserData) {
            res.send({ message: "seems like you have already an account" })
        } else {
            const data = new User({
                name: req.body.name,
                email: req.body.email,
                phonenumber: req.body.phonenumber,
                password: req.body.password
            })
            data.save(() => {
                if (err) {
                    res.send(err)
                } else {
                    res.send({ message: "user register succefully" })
                }
            })
        }
    })

})


// ! Post Details sending to Server
app.get('/post', async (req, res) => {
    try {
        const posts = await Post.find()
        res.send(posts)
    } catch (error) {
        console.log(error);
    }
})


// ! Adding posts in POST/FOOD
app.post('/add-post', async (req, res) => {
    let postdata = new Post({
        author: req.body.author,
        title: req.body.title,
        summary: req.body.summary,
        image: req.body.image,
        location: req.body.location
    })
    try {
        await postdata.save()
        res.send({ message: "posts added succefully" })
    } catch (err) {
        res.send({ message: "Failed to add posts" })
    }
})


// !  User Details sending to Server
app.get('/user', async (req, res) => {
    try {
        const user = await User.find()
        res.send(user)
    } catch (error) {
        console.log(error);
    }
})


// ! Seding SinglePost Details sending to Server
app.get('/post/:id', async (req, res) => {
    const { id } = req.params
    try {
        const singlePost = await Post.findById(id)
        res.send(singlePost)
    } catch (error) {
        res.send(error)
    }
})


// ! Deleting particular  post
app.delete('/post/:id', async (req, res) => {

    const result = await Post.deleteOne({ _id: req.params.id })
    res.send(result)
})


// ! Update particular post
app.put('/post/:id', async (req, res) => {
    let result = await Post.findByIdAndUpdate(
        { _id: req.params.id },
        {
            $set: { author: req.body.author, title: req.body.title, summary: req.body.summary, image: req.body.image, location: req.body.location, }
        }
    )
    res.send(result)
})


// !to frefill the record in form
app.get('/post/:id', async (req, res) => {
    let result = await Post.findOne({ _id: req.params.id });
    if (result) {
        res.send(result)
    } else {
        res.send({ result: "no record found" })
    }
})


// ! listining to Server
app.listen(PORT, () => {
    console.log(`listening to the port ${PORT}`);
})