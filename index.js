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

const upload = multer({ storage });

app.post('/', upload.single('file'), function (req, res) {
  const { mimetype, filename, size } = req.file

  res.json({
    filename,
    mimetype,
    size,
    url: `${req.protocol}://${req.hostname}/uploads/${filename}`,
  });
});

app.get('/', (_req, res) => res.sendFile(
    path.join(__dirname, 'public', 'upload.html')
));

app.use('/uploads', express.static(__dirname + '/uploads'));

app.listen(PORT, () =>
  console.log(`Running in ${PORT}`)
);