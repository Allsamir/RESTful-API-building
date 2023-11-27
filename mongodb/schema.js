const mongoose = require('mongoose');

const dataSchema = mongoose.Schema({
          title:{
                    type: String,
                    required: true
          },
          content: {
                    type: String,
                    required: true
          }
});

module.exports = dataSchema;