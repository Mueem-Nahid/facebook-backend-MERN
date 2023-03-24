const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const {readdirSync} = require('fs');
const dotenv = require('dotenv');
const fileUpload = require('express-fileupload');
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(fileUpload({useTempFiles: true}));

// dynamic routing
readdirSync('./routes')
   .map((r) => app.use('/', require('./routes/' + r)));

// database
mongoose.connect(process.env.DATABASE_URL, {
   useNewUrlParser: true,
})
   .then(() => console.log('Database connected successfully !'))
   .catch((err) => console.log('Error connecting to mongodb: ', err))

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
   console.log('Server is listening at port: ', PORT);
})

