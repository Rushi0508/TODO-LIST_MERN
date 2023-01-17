//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');

const app = express();
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.set('strictQuery', false);
// Setting Up connection
mongoose.connect('mongodb://localhost:27017/todolistDB' , {useNewUrlParser: true}).then(()=>{
    console.log("Mongo Connected");
}).catch(err=>{
    console.log("OH error");
    console.log(err);
});

const itemSchema = {
    name: String
}

const Item = mongoose.model("item", itemSchema);

app.get("/", function(req, res) {
  Item.find({}, (e, items)=>{
    res.render("list", {listTitle: "Today, " + new Date().toDateString(), newListItems: items});
  })
});

app.post("/delete", function(req, res){
  const deleteItem = req.body.checked;
  Item.deleteOne({_id: deleteItem}, (e)=>{
    if(e){
      console.log(e);
    }else{
      res.redirect("/");
    }
  }) 
});

app.post("/", function(req, res){
    const newItem = req.body.newItem;
    const item = new Item({
      name: newItem
    })
    item.save();
    res.redirect("/");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
