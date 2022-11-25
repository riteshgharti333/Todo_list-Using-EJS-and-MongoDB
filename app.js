const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();



app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"));


mongoose.connect("mongodb://localhost:27017/todolistDB" , {useNewUrlParser: true});


const itemSchema = {
  name: String
}


const Item = mongoose.model("Item" , itemSchema);


const item1 = new Item({
  name: "welcome"
})

const item2 = new Item({
  name: "welcome back"
})

const item3 = new Item({
  name: "welcome back again"
});

const defaultItems = [item1,item2,item3];

const listSchema = {
  name: String,
  items:[itemSchema]
}

const List = mongoose.model("List" , listSchema);

app.get("/", function (req, res) {
     

Item.find({} , function(err,foundItems){
    
  if(foundItems.length == 0){
    Item.insertMany(defaultItems, function(err){
  if(err){
    console.log(err);
  }else{
    console.log("success");
  }
})
res.redirect("/");
  }else{
    res.render("list", { 
      kind: "Today",
      newListItems: foundItems
  })
  }
})
});



app.get("/:customListName" , function(req, res){
  const customListName = req.params.customListName;

  List.findOne({name: customListName} , function(err , foundList){
    if(!err){
      if(!foundList){
        // create new lisit
        
  const list = new List({
    name: customListName,
    items: defaultItems
  })
  list.save();

      }else{
        // exting list

        res.render("list" , { 
          kind: foundList.name,
          newListItems: foundList.items
      })
      }
    }
  })

  
})

app.post("/" , function(req , res){

   const itemName = req.body.newItem;
   
   const item = new Item({
    name: itemName
   })
   
   item.save();
   res.redirect("/");
})


app.post("/delete" , function(req,res){
    const checkedItemBody = req.body.checkBox;

  Item.findByIdAndRemove(checkedItemBody,function(err){
    if(!err){
      console.log("success deleted");
      res.redirect("/")
    }
  })

})


app.post("/work" , function(res,req){
   let item = res.body.newItem;
   workItems.push(item);
   res.redirect("/work");
})

app.listen(3000, function () {
  console.log("server is started");
});
