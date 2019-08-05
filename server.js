const express = require("express")
const bodyparser = require("body-parser")
const session = require("express-session")
const cookieparser = require("cookie-parser")
const mongoose = require("mongoose")
const multer = require("multer")
const {User} = require("./models/user.js")
const {Dog} = require("./models/dog.js")
const {Feedback} = require("./models/feedback.js")
const {Request} = require("./models/request.js")
var upload = multer({dest: './public/uploads/'})


const app = express()
const urlencoder = bodyparser.urlencoded({
    extended: false
})

mongoose.Promise = global.Promise
mongoose.connect("mongodb://localhost:27017/PAWSter_Care_db", {
    useNewUrlParser: true
})

app.use(express.static(__dirname + "/public"))
app.use(session({
    secret: "secretname",
    resave: true, 
    saveUninitialized: true
}))

app.get(["/", "/homepage.hbs", "/home"], (req, res)=>{
    if(!req.session.username){                                      // default would be the login page (no account yet)
        res.sendFile(__dirname + "/public/login.html")
    }
    else{                                                           // remember the user who logged in
        res.render("homepage.hbs", {
            username: req.session.username
        })
    }
})

app.get(["/meet_the_dogs","/meet_the_dogs.hbs","/dogs"], (req, res)=>{
        Dog.find({
        
        }, (err, doc)=>{
            if(err){
                res.send(err)
            }
            else{                                 
                res.render("meet_the_dogs.hbs", {
                    username: req.session.username,
                    db: doc
                })
            }
        })
    })

app.get("/check", (req, res)=>{                // just find the user given the id
    console.log("GET /check_dog/" + req.query.id)
    
    Dog.findOne({
        _id: req.query.id                     // just get the query, not body
    }, (err, doc)=>{
        if(err){
            res.send(err)
        }
        else{                                 // send all details of the user to edit.hbs
            res.render("check_dog.hbs", {
                username: req.session.username,
                dog: doc
            })
        }
    })
})
app.get(["/policies","/policies.hbs"], (req, res)=>{
    res.render("policies.hbs", {
        username: req.session.username
    })
})

app.get(["/protocols","/protocols.hbs"], (req, res)=>{
    res.render("protocols.hbs", {
        username: req.session.username
    })
})

app.get(["/requests","/requests.hbs"], (req, res)=>{
    res.render("requests.hbs", {
        username: req.session.username
    })
})

app.get(["/contact","/contact.hbs"], (req, res)=>{
    res.render("contact.hbs", {
        username: req.session.username
    })
})

app.get("/feedbackform.hbs", (req, res)=>{
    res.render("feedbackform.hbs", {
        username: req.session.username
    })
})

app.get("/requestform.hbs", (req, res)=>{
    res.render("requestform.hbs", {
        username: req.session.username
    })
})

app.get("/faq.hbs", (req, res)=>{
    res.render("faq.hbs", {
        username: req.session.username
    })
})

app.get(["/aboutus","/aboutus.hbs"], (req, res)=>{
    res.render("aboutus.hbs", {
        username: req.session.username
    })
})

app.get("/edit_profile.hbs", (req, res)=>{
    console.log(req.session._id)
    res.render("edit_profile.hbs", {
        username: req.session.username
    })
})


app.get("/admin_main.hbs", (req, res)=>{
    res.render("admin_main.hbs", {
        username: req.session.username
    })
})

app.get("/admin_dogs.hbs", (req, res)=>{    
    Dog.find({
        
    }, (err, doc)=>{
        if(err){
            res.send(err)
        }
        else{                                 
            res.render("admin_dogs.hbs", {
                db: doc
            })
        }
    })
})

app.get("/admin_add_dog.hbs", (req, res)=>{
    res.render("admin_add_dog.hbs", {
        username: req.session.username
    })
})

app.get("/edit", (req, res)=>{                // just find the user given the id
    console.log("GET /admin_edit_dog/" + req.query.id)
    
    Dog.findOne({
        _id: req.query.id                     // just get the query, not body
    }, (err, doc)=>{
        if(err){
            res.send(err)
        }
        else{                                 // send all details of the user to edit.hbs
            res.render("admin_edit_dog.hbs", {
                dog: doc
            })
        }
    })
})

app.get("/admin_requests.hbs", (req, res)=>{
    Request.find({
        
    }, (err, doc)=>{
        if(err){
            res.send(err)
        }
        else{                                 
            res.render("admin_requests.hbs", {
                requests: doc
       })
    }
    })
})

app.get("/admin_userTable.hbs", (req, res)=>{
    
    User.find({
        
    }, (err, doc)=>{
        if(err){
            res.send(err)
        }
        else{                                 
            res.render("admin_userTable.hbs", {
                users: doc
        })
    }  
})
})

app.get("/admin_dogTable.hbs", (req, res)=>{
    
    Dog.find({
        
    }, (err, doc)=>{
        if(err){
            res.send(err)
        }
        else{                                 
            res.render("admin_dogTable.hbs", {
                dogs: doc
       })
    }  
})
})

app.get("/admin_feedbackTable.hbs", (req, res)=>{
    
    Feedback.find({
        
    }, (err, doc)=>{
        if(err){
            res.send(err)
        }
        else{                                 
            res.render("admin_feedbackTable.hbs", {
                feedbacks: doc
       })
    }  
})
})

app.post("/login", urlencoder, (req, res)=>{
    var username = req.body.uname
    var password = req.body.pass 
         
    User.findOne({
         username, password
         }, (err, doc)=>{
            if(err){
                res.send(err)
            }
            else if(doc){
                console.log(doc)
                req.session.username = doc.username
                if (doc.username == 'admin')
                res.redirect("/admin_main.hbs")
                else
                res.redirect("/")
            }
            else{
                res.redirect("/error.html")
            }
        })
})

app.post("/signup", urlencoder, (req, res)=>{
    var username = req.body.uname
    var password = req.body.pass
    var email = req.body.email
         
    let user = new User({
         username, password, email
    })

    user.save().then((doc)=>{
        console.log(doc)                                            // print the user details if successfully saved
        req.session.username = doc.username
        res.render("homepage.hbs", {
            username: doc.username                                  // get the username to display in the navbar
        })
    },(err)=>{
        res.send(err)
    })
})

app.post("/edit_profile", urlencoder, (req, res)=>{
    
    User.update({                              // where clause
       username: req.session.username 
    }, {                                       // new info that you want to add
        username: req.body.uname,
        email: req.body.email,
        password: req.body.pass
    }, (err, doc)=>{
       if (err){
           res.send(err)
       }
        else{
            req.session.username = req.body.uname
            res.redirect("/homepage.hbs")
        }
    })
    
})

app.post("/request", urlencoder, (req, res)=>{
    console.log("request sent")
    var reqName = req.body.reqfirst + " " + req.body.reqmiddle + " " + req.body.reqlast
    var reqEmail = req.body.reqemail
    var reqDog = req.body.reqdog
    var reqStatus = "pending"
         
    let request = new Request({
         reqName, reqEmail, reqDog, reqStatus
    })

    request.save().then((doc)=>{
        console.log(doc)                                            // print the user details if successfully saved
        req.session.username = doc.username
        res.render("homepage.hbs", {
            username: doc.username                                  // get the username to display in the navbar
        })
    },(err)=>{
        res.send(err)
    })
})

app.post("/approve", urlencoder, (req, res)=>{

    console.log(req.body.reqid)
    Request.update({                              
       _id: req.body.reqid 
    }, {                                       
        reqStatus: "approved"
    }, (err, doc)=>{
       if (err){
           res.send(err)
       }
        else{
            res.redirect("/admin_requests.hbs")
        }
    }) 
})

app.post("/reject", urlencoder, (req, res)=>{

    console.log(req.body.reqid)
    Request.update({                              
       _id: req.body.reqid 
    }, {                                       
        reqStatus: "rejected"
    }, (err, doc)=>{
       if (err){
           res.send(err)
       }
        else{
            res.redirect("/admin_requests.hbs")
        }
    }) 
})



app.post('/admin_add_dog', upload.single('dog_image'), function (req, res, next) {
    if(req.file != undefined){
    var name = req.body.dog_name
    var breed = req.body.dog_breed.toLowerCase()
    var birthday = req.body.dog_birthday
    var gender = req.body.dog_gender
    var height = req.body.dog_height
    var weight = req.body.dog_weight
    var conditions = req.body.dog_conditions
    var image = req.file.filename
    
    let dog = new Dog({
        name, breed, birthday, gender, height, weight, conditions, image
    })
    
    dog.save().then((doc)=>{
        console.log(doc)                                             
    })  
    res.redirect("/admin_dogs.hbs")
    }
    else{
        res.redirect("/admin_dogs.hbs")
    }
})

app.post('/admin_edit_dog', upload.single('dog_image'), function (req, res, next) {
    if(req.file != undefined){
    Dog.update({                              // where clause
       _id: req.body.id 
    }, {                                       // new info that you want to add
        name: req.body.dog_name,
        breed: req.body.dog_breed.toLowerCase(),
        birthday: req.body.dog_birthday,
        gender: req.body.dog_gender,
        height: req.body.dog_height,
        weight: req.body.dog_weight,
        conditions: req.body.dog_conditions,
        image: req.file.filename
    }, (err, doc)=>{
       if (err){
           res.send(err)
       }
        else{
            res.redirect("/admin_dogs.hbs")
        }
    })
    }
    else{
       Dog.update({                              // where clause
       _id: req.body.id 
    }, {                                       // new info that you want to add
        name: req.body.dog_name,
        breed: req.body.dog_breed.toLowerCase(),
        birthday: req.body.dog_birthday,
        gender: req.body.dog_gender,
        height: req.body.dog_height,
        weight: req.body.dog_weight,
        conditions: req.body.dog_conditions,
    }, (err, doc)=>{
       if (err){
           res.send(err)
       }
        else{
            res.redirect("/admin_dogs.hbs")
        }
    }) 
    }
})

app.post("/feedbackform", urlencoder, (req, res)=>{
    var fName = req.body.fname
    var lName = req.body.lname
    var eMail = req.body.email
    var fText = req.body.ftext
    
    let feedback = new Feedback({
        fName, lName, eMail, fText
    })
    
    feedback.save().then((doc)=>{
        console.log(doc)                                             
        res.redirect("/")
    })

})

app.post("/delete", urlencoder, (req, res)=>{
    console.log("POST /delete " + req.body.id)
    Dog.deleteOne({
        _id: req.body.id
    }, (err, doc)=>{
        if (err){
            res.send(err)
        }
        else{
//            res.redirect("/users")
            console.log(doc)
            res.send(doc)
        }
    })
})

app.listen(3000, function(){                  // read from this port
    console.log("Now listening at port 3000!");
})