const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/userRoutes');
const app = express();
app.use(cors());
require('./db/dbConfig');
const port = process.env.PORT || 5000 ;

app.use(express.json());
 
app.use('/api/user/',userRouter);

app.listen(port, ()=> console.log(`Server started at ${port}`))