var mongoose=require('mongoose');
var Schema=mongoose.Schema;

var resourcesSchema = new Schema({
  id: String,
  name: String,
  url: String
});

module.exports = mongoose.model('Resources', resourcesSchema);