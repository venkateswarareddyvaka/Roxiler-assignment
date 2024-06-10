const express = require('express')
const mongoose = require('mongoose')
const Product = require('./models/productsModel.js')
const cors = require('cors');
const {insertingData} = require('./controllers/productControllers.js')
const transactionRoutes = require('./routes/productRoutes.js');
const statisticsRoutes = require('./routes/statisticsRoutes.js');
const barChartRoutes = require('./routes/barchartsRoutes.js')
const axios = require('axios')
require('dotenv').config()

const app = express();

const port = process.env.PORT
const mongo_url = process.env.MONGO_URL

app.use(express.json())
app.use(cors());

app.use('/api/transactions', transactionRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/barcharts', barChartRoutes);

app.get('/',insertingData)


mongoose.connect(mongo_url)
    .then(()=>{
        console.log("App connected to DataBase")
        app.listen(port,()=>{
            console.log(`Server is up and Listening to port ${port}`)
        })

    })
    .catch((error)=>{
        console.log(error.message)
    })