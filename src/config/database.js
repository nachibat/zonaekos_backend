const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/zonaekos', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(db => console.log('Connected to mongodb server:', db.connection.host))
    .catch(err => console.error(err));