const mongoose = require('mongoose');

if (process.env.NODE_ENV === 'dev') {
    mongoose.connect(`mongodb://localhost/${process.env.DB_NAME}`, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
        .then(db => console.log('Connected to mongodb server:', db.connection.host))
        .catch(err => console.error(err));
} else {
    mongoose.connect(`${process.env.DB_URI}/${process.env.DB_NAME}?authSource=admin`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(db => console.log('Connected to mongodb server:', db.connection.host))
        .catch(err => console.error(err));
}
