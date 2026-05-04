const express = require("express");
const cors = require("cors")
const mongoose = require("mongoose");
const app = express();

mongoose.connect("mongodb://arun_db:arun123@ac-nup6vdg-shard-00-00.memngra.mongodb.net:27017,ac-nup6vdg-shard-00-01.memngra.mongodb.net:27017,ac-nup6vdg-shard-00-02.memngra.mongodb.net:27017/?ssl=true&replicaSet=atlas-i7c10e-shard-0&authSource=admin&appName=Cluster0")
.then(() => console.log("MongoDB Connected"))
.catch((err) => console.log("DB Error:", err));

const employeeSchema = new mongoose.Schema({
  employee: String,
  loginTime: String,
  app: String,
  cpu: Number,
  memory: Number,
});

const Employee = mongoose.model("Employee", employeeSchema);


app.use(cors())
app.use(express.json());

let storedData = [];

app.post("/api/data", async (req, res) => {
   try {
      const newData = req.body;

      const existing = await Employee.findOne({
         employee : newData.employee,
      });

      if(existing){
         await Employee.updateOne({
            employee : newData.employee
         }, newData
      );
      } else{
         const emp = new Employee(newData);
         await emp.save();
      }
      res.json({status : "saved to DB"});
   } catch(err){
      console.log(err);
      res.status(500).json({error : "DB error"});
   }
});

app.get("/api/data", async (req, res) => {
   const data = await Employee.find();
   res.json(data);
});

app.listen(5000, () => {
   console.log("Server is running on the port 5000");
});