const express = require('express')
const app = express();


const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const cors = require('cors')
let PORT = 4000;


// require database model
const User = require('./models/user')
const Post = require('./models/posts')

// middleware
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors())  //cross origin resourse sharing

const dbURL = "mongodb://localhost:27017/fodiee"
mongoose.connect(dbURL).then(() => {
    console.log("connected successfullady to database");
})

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
app.get('/post', async (req, res) => {
    try {
        const posts = await Post.find()
        res.send(posts)
    } catch (error) {
        console.log(error);
    }
})

app.get('/user', async(req, res) => {
    try {
        const user = await User.find()
        res.send(user)
    } catch (error) {
        console.log(error);
    }
})


app.get('/post/:id', async (req, res) => {
    const {id} = req.params
    try {
        const singlePost =await Post.findById(id)
        res.send(singlePost)
    } catch (error) {
        res.send(error)
    }
})


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
app.listen(PORT, () => {
    console.log(`listening to the port ${PORT}`);
})