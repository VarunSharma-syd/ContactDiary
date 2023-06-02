const express = require('express');

const app = express();  //intialize

app.get('/', (req,res)=> res.json({msg: "Welcome to the Portal"}));

//Define Routes

app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contact', require('./routes/contact'));

const PORT = process.env.PORT || 5000;


app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));