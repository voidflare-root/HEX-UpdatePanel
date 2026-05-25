const express=require("express");
const fs=require("fs");
const app=express();

app.use(express.json({limit:"50mb"}));
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/raw/config.json",(req,res)=>{
 res.sendFile(__dirname+"/data/config.json");
});

app.post("/update",(req,res)=>{
 const content=req.body.config || "";
 fs.writeFileSync("./data/config.json", content);
 res.json({success:true,message:"Updated"});
});

app.listen(process.env.PORT || 3000,()=>{
 console.log("Running...");
});
