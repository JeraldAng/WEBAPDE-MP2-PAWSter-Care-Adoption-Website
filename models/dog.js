const mongoose = require("mongoose")

var Dog = mongoose.model("dog", {             
    name: String,
    breed: String,
    height: Number,
    weight: Number,
    gender: String, 
    birthday: String,
    conditions: String,
    image: String
})


module.exports ={
    Dog
}
