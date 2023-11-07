const express = require('express');
const router = require('./src/Router/BaseRouter');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const PORT = 3000;



app.use(express.json());

app.get('/', (req, res)=>{
    res.status(200);
    res.send("Welcome to root URL of Servers");
});

app.use('/api/v1',router)

  
app.listen(PORT, (error) =>{
    if(!error)
        console.log("Server is Successfully Running, and App is listening on port "+ PORT)
    else 
        console.log("Error occurred, server can't start", error);
    }
);