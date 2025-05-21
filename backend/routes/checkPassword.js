// backend/routes/checkPassword.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Load common passwords
const commonPasswords = new Set(
  fs.readFileSync(path.join(__dirname, '../data/common-passwords.txt'), 'utf-8').split('\n')
);

router.post('/check-common', (req, res) => {
  const { password } = req.body;
  const isCommon = commonPasswords.has(password);
  res.json({ common: isCommon });
});

module.exports = router;
