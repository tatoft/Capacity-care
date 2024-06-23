const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  birthDate: { type: Date, required: true },
  age: { type: Number, required: true },
  address: { type: String, required: true },
  documentNumber: { type: String, required: true }
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
