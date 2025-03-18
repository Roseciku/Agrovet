const express = require('express');
const db = require('./config/db');
const dotenv = require('dotenv');
const routes = require('./routes/route');
const cors = require('cors');
const cookieParser = require('cookie-parser')

dotenv.config();
const app = express();


app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use('/images', express.static('public/images'));

app.use(cookieParser())
app.use(cors({ origin: "http://localhost:5173", credentials: true }));


app.use('/api', routes)

const PORT = process.env.PORT || 5500;

app.listen(PORT, ()=>{
    console.log(`Server is running at :http://localhost:${PORT}`);
})