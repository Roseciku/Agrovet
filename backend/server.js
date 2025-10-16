const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes/route');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const path = require("path");

dotenv.config();
const app = express();


app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use('/images', express.static(path.join(__dirname,'public/images')));

app.use(cookieParser())
app.use(cors({ origin: ["https://farmmateagrovet.netlify.app"], credentials: true }));


app.use('/api', routes)

const PORT = process.env.PORT;

app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`);
})