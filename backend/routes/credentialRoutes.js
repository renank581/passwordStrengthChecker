const express = require('express');
const router = express.Router();
const credentialController = require('../controllers/credentialController');
const { authenticateUser } = require('../middleware/authMiddleware');

router.post('/', authenticateUser, credentialController.addCredential);
router.get('/', authenticateUser, credentialController.getCredentials);
router.delete('/:id', authenticateUser, credentialController.deleteCredential);
router.put('/:id', authenticateUser, credentialController.updateCredential); // ✅ ADD THIS LINE

module.exports = router;
