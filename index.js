const express = require('express');
const multer = require('multer');
const uuidv4 = require('uuid/v4');
const path = require('path');
const cors = require('cors');

const app = express()

const { PORT } = process.env

app.use(express.static('uploads'));
app.use(cors())

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads');
  },
  filename: (_req, file, cb) => {
    const filename = uuidv4() + path.extname(file.originalname);

    cb(null, filename);
  }
});

const upload = multer({ storage: storage });

app.post('/', upload.single('file'), function (req, res, next) {
  const { mimetype, filename, size } = req.file
  const url = `http://localhost:${PORT}/${filename}`;

  res.json({
    filename,
    mimetype,
    url,
    size
  });
});

app.get('/', (_req, res) => res.send("running"));

app.listen(PORT, () =>
  console.log(`Running in ${PORT}`)
);