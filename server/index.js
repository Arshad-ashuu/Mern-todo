const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const PORT = 3000;
const TodoModel = require("./Model/Todo");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect("mongodb+srv://mohammadarshad01474:arshadtodo@cluster0.805256l.mongodb.net/todo?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
  console.log("Connected to MongoDB");
})
.catch((err) => {
  console.error("Error connecting to MongoDB:", err);
});

// Routes
app.post('/add', async (req, res) => {
  const task = req.body.task;
  try {
    const newTask = await TodoModel.create({ task });
    res.json(newTask);
  } catch (error) {
    console.error("Error adding task:", error);
    res.status(500).json({ success: false });
  }
});

app.get("/get",(req,res)=>{
    TodoModel.find()
    .then((result)=>res.json(result))
    .catch((err)=>console.log(err))
})

app.put("/check/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const todo = await TodoModel.findById(id);
        todo.done = !todo.done; // Toggle the done property
        await todo.save();
        res.json(todo);
    } catch (error) {
        console.error("Error toggling task:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
})

app.put("/update/:id", async (req, res) => {
  const { id } = req.params;
  const { task } = req.body;
  try {
    // Find the todo item by ID and update it with the new task content
    const updatedTodo = await TodoModel.findByIdAndUpdate(id, { task });
    if (!updatedTodo) {
      return res.status(404).json({ success: false, message: "Todo not found" });
    }
    res.json(updatedTodo);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


app.delete("/delete/:id",(req,res)=>{
   const {id} = req.params
  TodoModel.findByIdAndDelete({_id:id})
 .then(result => res.json(result))
 .catch(err => res.json(err))

    
})


// Start server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
