// File: backend/controllers/credentialController.js
const Credential = require('../models/Credential');
const crypto = require('crypto');

const algorithm = 'aes-256-ctr';
const secretKey = process.env.CRYPTO_SECRET || 'default_secret_key';

function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const key = crypto.scryptSync(secretKey, 'salt', 32);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decrypt(hash) {
  try {
    if (!hash.includes(':')) throw new Error('Invalid encrypted format');
    const [ivHex, contentHex] = hash.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    const content = Buffer.from(contentHex, 'hex');
    const key = crypto.scryptSync(secretKey, 'salt', 32);
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    const decrypted = Buffer.concat([decipher.update(content), decipher.final()]);
    return decrypted.toString('utf8');
  } catch (err) {
    console.error('❌ Failed to decrypt:', err.message);
    return '[DECRYPTION_FAILED]';
  }
}

exports.addCredential = async (req, res) => {
  try {
    const { website, username, password } = req.body;
    console.log("💾 Saving credential for user ID:", req.user?.id);
    const encryptedPassword = encrypt(password);
    const credential = new Credential({
      userId: req.user.id,
      website,
      username,
      password: encryptedPassword
    });
    await credential.save();
    res.status(201).json(credential);
  } catch (error) {
    console.error("❌ Error in addCredential:", error);
    res.status(500).json({ error: 'Failed to save credentials', details: error.message });
  }
};

exports.getCredentials = async (req, res) => {
  try {
    const credentials = await Credential.find({ userId: req.user.id });
    const decrypted = credentials.map(cred => ({
      ...cred._doc,
      password: decrypt(cred.password)
    }));
    res.status(200).json(decrypted);
  } catch (error) {
    console.error("❌ Error in getCredentials:", error);
    res.status(500).json({ error: 'Failed to fetch credentials' });
  }
};

exports.deleteCredential = async (req, res) => {
  try {
    const { id } = req.params;
    await Credential.deleteOne({ _id: id, userId: req.user.id });
    res.status(200).json({ message: 'Deleted successfully' });
  } catch (error) {
    console.error("❌ Error in deleteCredential:", error);
    res.status(500).json({ error: 'Failed to delete credential' });
  }
};

exports.updateCredential = async (req, res) => {
  try {
    const { id } = req.params;
    const { website, username, password } = req.body;

    const encryptedPassword = encrypt(password);

    const updated = await Credential.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { website, username, password: encryptedPassword },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Credential not found or not authorized' });
    }

    res.status(200).json({ message: 'Credential updated successfully' });
  } catch (error) {
    console.error("❌ Error in updateCredential:", error);
    res.status(500).json({ error: 'Failed to update credential' });
  }
};
