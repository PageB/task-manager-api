const express = require('express');
const router = new express.Router();
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail, sendGoodByeEmail } = require('../emails/account');

router.post('/users', async (req, res) => {
  const user = new User(req.body);

  try {
    await user.save();
    await sendWelcomeEmail(user.email, user.name);

    const token = await user.generateAuthToken();

    res.status(201).send({ user, token});
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post('/users/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findByCredentials(email, password);
    const token = await user.generateAuthToken();
  
    res.status(200).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post('/users/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });

    await req.user.save();

    res.status(200).send();
  } catch (e) {
    res.status(500).send(e);
  }
});


router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];

    await req.user.save();

    res.status(200).send();
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get('/users/me', auth, async (req, res) => {
  console.log(req.user)

  res.send(req.user);
});

router.patch('/users/me', auth, async (req, res) => {
  const body = req.body;
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'age', 'password'];
  const isValidUpdate = updates.every((update) => allowedUpdates.includes(update))
  
  if (!isValidUpdate) {
    return res.status(400).send({ error: 'Invalid updates.'})
  }

  try {
    updates.forEach((update) => req.user[update] = body[update]);
    await req.user.save();

    res.status(200).send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove();
    sendGoodByeEmail(req.user.email, req.user.name);

    res.status(200).send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
});

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    // const fileType = file.originalname.endsWith('.pdf');
    // const fileType = file.originalname.match(/\.(doc|docx)$/);
    const fileType = file.originalname.match(/\.(jpg|jpeg|png)$/);

    if (!fileType) {
      return cb(new Error('File must me a jpg/png file type.'));
    } else {
      return cb(undefined, true);
    }
  }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer)
      .png()
      .resize({ width: 250, height: 250 })
      .toBuffer()

    req.user.avatar = buffer;
    await req.user.save();
    
    res.status(200).send();
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
});

router.delete('/users/me/avatar', auth, async (req, res) => {
  req.user.avatar = undefined;
  await req.user.save();
  
  res.status(200).send();
});

router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || !user.avatar) {
      throw new Error();
    }

    res.set('Content-type', 'image/jpg');
    res.status(200).send(user.avatar);
  } catch (e) {
    res.status(404).send(e);
  }
});


module.exports = router;