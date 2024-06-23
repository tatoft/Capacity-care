const mongoose = require('mongoose');

mongoose.connect('mongodb://database:27017/CapacityCare', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(db => console.log('DB está corriendo en', db.connection.host))
  .catch(err => console.error(err));
