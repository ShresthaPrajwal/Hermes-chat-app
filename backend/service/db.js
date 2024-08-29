const mongoose = require('mongoose');
const config = require('../config/config');

mongoose.set('strictQuery', false);

mongoose
  .connect(config.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error Connecting to MongoDB:', error.message);
  });

module.exports = mongoose;
