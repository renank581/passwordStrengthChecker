// models/Credential.js
const mongoose = require('mongoose');

const CredentialSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  website: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true } // Store encrypted!
});

module.exports = mongoose.model('Credential', CredentialSchema);
