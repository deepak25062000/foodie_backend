
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

//? This is a backend route defined with Express.js. It handles a POST request to '/signin' and performs the following steps:
//? It uses the Mongoose method findOne() to search for a User document in the database whose email property matches the email value provided in the request body.
//? If a user is found, it compares the password property of the found User document with the password value provided in the request body.
//? If the passwords match, it sends a response to the client with a JSON object containing a message property with the value 'signin successful'.
//? If the passwords do not match, it sends a response to the client with a JSON object containing a message property with the value 'signin failed'.
//? If no user is found with the given email address, it sends a response to the client with a JSON object containing a message property with the value 'no account seems to be matching with your email address'.


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

//? This is a backend route defined with Express.js. It handles a POST request to '/signup' and performs the following steps:

//? It uses the Mongoose method findOne() to search for a User document in the database whose email property matches the email value provided in the request body.
//? If a user is found, it sends a response to the client with a JSON object containing a message property with the value 'seems like you have already an account'.
//? If no user is found with the given email address, it creates a new User object using the req.body parameters, and saves it to the database using the save() method.
//? If an error occurs during the save operation, it sends a response to the client with the error message.
//? If the save operation is successful, it sends a response to the client with a JSON object containing a message property with the value 'user registered successfully'.


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

//? This is a backend route defined with Express.js. It handles a GET request to '/post' and performs the following steps:

//? It uses the Mongoose method find() to retrieve all Post documents from the database.
//? It stores the retrieved documents in a variable named posts.
//? It sends the posts variable as the response to the client with a status code of 200 (OK).
//? If an error occurs during the retrieval operation, it catches the error and logs it to the console.


app.get('/post', async (req, res) => {
    try {
        const posts = await Post.find()
        res.send(posts)
    } catch (error) {
        console.log(error);
    }
})


// ! Adding posts in POST/FOOD

//? This is a backend route defined with Express.js. It handles a POST request to '/add-post' and performs the following steps:

//? It creates a new Post object using the req.body parameters.
//? It saves the new Post object to the database using the save() method.
//? If the save operation is successful, it sends a response to the client with a JSON object containing a message property with the value 'post added successfully'.
//? If an error occurs during the save operation, it catches the error and sends a response to the client with a JSON object containing a message property with the value 'Failed to add posts'.


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

//? This is a backend route defined with Express.js. It handles a GET request to '/user' and performs the following steps:

//? It uses the Mongoose method find() to retrieve all User documents from the database.
//? It stores the retrieved documents in a variable named user.
//? It sends the user variable as the response to the client with a status code of 200 (OK).
//? If an error occurs during the retrieval operation, it catches the error and logs it to the console.


app.get('/user', async (req, res) => {
    try {
        const user = await User.find()
        res.send(user)
    } catch (error) {
        console.log(error);
    }
})


// ! Seding SinglePost Details sending to Server

//? This is a backend route defined with Express.js. It handles a GET request to '/post/:id', where :id is a parameter in the URL that represents the unique identifier of a Post document in the database. The route performs the following steps:

//? It extracts the id parameter from the request using req.params.
//? It uses the Mongoose method findById() to retrieve the Post document with the given id from the database.
//? It stores the retrieved document in a variable named singlePost.
//? It sends the singlePost variable as the response to the client with a status code of 200 (OK).
//? If an error occurs during the retrieval operation, it catches the error and sends an error response to the client with a status code of 500 (Internal Server Error).


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

//? This is a backend route defined with Express.js. It handles a DELETE request to '/post/:id', where :id is a parameter in the URL that represents the unique identifier of a Post document in the database. The route performs the following steps:

//? It uses the Mongoose method deleteOne() to delete the Post document with the given _id from the database.
//? It stores the result of the deletion operation in a variable named result.
//? It sends the result variable as the response to the client.
//? Note that the result variable contains an object with information about the deletion operation, such as the number of documents deleted.

app.delete('/post/:id', async (req, res) => {

    const result = await Post.deleteOne({ _id: req.params.id })
    res.send(result)
})


// ! Update particular post

//? This is a backend route defined with Express.js. It handles a PUT request to '/post/:id', where :id is a parameter in the URL that represents the unique identifier of a Post document in the database. The route performs the following steps:

//? It uses the Mongoose method findByIdAndUpdate() to find the Post document with the given _id and update it with the new data provided in the request body.
//? It uses the $set operator to update only the fields specified in the request body, leaving the rest of the fields unchanged.
//? It stores the result of the update operation in a variable named result.
//? It sends the result variable as the response to the client.
//? Note that the result variable contains an object with information about the update operation, such as the number of documents matched and modified.


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

//? This is a backend route defined with Express.js. It handles a GET request to '/post/:id', where :id is a parameter in the URL that represents the unique identifier of a Post document in the database. The route performs the following steps:

//? It uses the Mongoose method findOne() to find the Post document with the given _id in the database.
//? It stores the result of the query in a variable named result.
//? It checks if result is not null, meaning that a Post document was found with the given _id.
//? If result is not null, it sends the result variable as the response to the client.
//? If result is null, it sends a message indicating that no record was found with the given _id.

app.get('/post/:id', async (req, res) => {
    let result = await Post.findOne({ _id: req.params.id });
    if (result) {
        res.send(result)
    } else {
        res.send({ result: "no record found" })
    }
})


// ! listining to Server

// ?This is a method call to app.listen() that starts the server and listens for incoming requests on the specified PORT. When the server starts, it logs a message to the console indicating that it is listening on the specified PORT. This is helpful for debugging and verifying that the server is up and running. The PORT variable is likely defined earlier in the code, and it specifies the port number that the server should listen on.

app.listen(PORT, () => {
    console.log(`listening to the port ${PORT}`);
})