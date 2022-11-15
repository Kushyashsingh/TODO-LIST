
const express = require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose')
const app = express();
app.use(bodyParser.urlencoded({extended:true}))
mongoose.connect("mongodb://localhost:27017/todo-listDB",{useNewUrlParser: true});

const ToDoSchema =new mongoose.Schema({
    task_id:{
      type: String,
    },
    name:{
      type: String,
    },
    description:{
      type: String,
    },
    category:{
      type: String,
    },
    priority:{
      type:String,
    },
  });
  const ToDo =new mongoose.model("ToDo", ToDoSchema); 


// This route should fetch tasks of a particular category and query, It should fetch all tasks if priority or category is not provided.
app.get("/tasks",function(req,res){
    ToDo.findOne(
        {
        catergory:req.params.category,
        priority:req.params.priority
        },
        function(req,res)
        {if(foundToDo)
            {
                res.send(foundToDo);
            }
            else
            {
                ToDo.find(function(err,foundToDo){
                    if(!err){
                    res.send(foundToDo)
                    }
                    else{
                        res.send(err)
                    }

                })
            }
        })
    })

// This route should create a new task
app.post("/tasks",function (req, res) {
    const newTask=new ToDo({
    task_id :req.body.task_id,
    name: req.body.name,
    description:req.body.description,
    category:req.body.category,
    priority:req.body.priority
    })
    newTask.save(function(err){
        if(!err){
            res.send("Saved new Task")
        }
        else{
            res.send(err)
        }
    })
  })
// This route should delete all tasks.  
app.delete("/tasks",function(req,res){
    ToDo.deleteMany(function(err){
            if(!err){
                res.send("successfully deleted")
            }
            else{
                res.send(err)
            }
        }
    )
})

//This route should fetch record of a particular task
app.get("/task/:task_id", function(req, res){
   ToDo.findOne({name: req.params.name},function(err, foundToDo){
          if (foundToDo) {
              res.send(foundToDo)
          } else {
              res.send("task not found");
          }
      });
    })

//This route should replace a task record with another task record.
app.put("/task/:task_id",function(req,res){
    ToDo.updateMany(
        {
         task_id: req.params.task_id,
         name: req.params.name,
         description: req.params.description,
         category: req.params.category,
         priority: req.params.priority,
        },
        {overwrite:true},
        function(err){
            if(!err){
                res.send("Successfully Updated")
            }
            else{
                res.send(err)
            }
        }
    )

})    
  //This route should update some fields of a task record.
  app.patch("/task/:task_id", function (req, res){
    const task_id = req.params.task_id;
    const task = ToDo.findOne({ task_id: task_id });
    const name = req.body.name || task.name;
    ToDo.update(
        {
         task_id: req.params.task_id,
         name: req.params.name,
         description: req.params.description,
         category: req.params.category,
         priority: req.params.priority,
        },
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Successfully Updated")
            }
            else{
                res.send(err)
            }
        }
    )
       
    })

//This route should delete a task.
app.delete("/task/:task_id", function (req, res) {
  ToDo.deleteOne({ name: req.params.task_id }, function (err) {
    if (!err) {
      res.send("succesfully deleted task");
    } else {
      res.send(err);
    }
  });
});

app.listen(9000,function()
{
  console.log("server is up")
});
