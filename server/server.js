const express = require("express");
const app = express();
const port = 8000;
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDb = require("./dbConnect");
const imgModel = require("./imgModel");

app.use(cors());
app.use(bodyParser.json());

connectDb();

app.post("/postImage", async function (req, res) {
  const { base64 } = req.body;
  const obj = {
    base64,
  };

  const result = await imgModel.create(obj);

  res.send("save hinh anh thanh cong");
});

app.get("/getCollection", async function (req, res) {
  try {
    const collection = await imgModel.find(); 

    
    

    res.json(collection); 
  } catch (error) {
    res.status(500).send("Error retrieving collection");
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
