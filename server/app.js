const express = require('express');
const app = express();
const dotenv = require('dotenv');

dotenv.config({path : './config.env'});

require('./database/connection');

app.use(express.json());
app.use(require('./routes/auth'));

const PORT = process.env.PORT;

const middleware = (req,res, next) => {
    console.log("middleware");
    next();
}

app.get('/',(req,res)=>{
    res.send("Hello Muskan from Express");
})

app.get('/about',middleware,(req,res)=>{
    console.log("about")
    res.send("Hello Muskan from About");
})

app.get('/contact',(req,res)=>{
    res.send("Hello Muskan from Contact");
})


app.listen(PORT,()=>{
    console.log("server running");
})
