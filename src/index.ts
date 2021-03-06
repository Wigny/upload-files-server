import cors from 'cors';
import express from 'express';
import multer from 'multer';
import path from 'path';
import serveIndex from 'serve-index';
import { v4 as uuidv4 } from 'uuid';

const app = express();

const { PORT } = process.env;

const uploadsPath = path.join(__dirname, '..', '/uploads');

app.use(cors());

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads');
  },
  filename: (_req, file, cb) => {
    const filename = uuidv4() + path.extname(file.originalname);

    cb(null, filename);
  },
});

const upload = multer({ storage });

app.post('/', upload.single('file'), ({ protocol, hostname, file }, res) => {
  const { mimetype, filename, size } = file;

  res.json({
    filename,
    mimetype,
    size,
    url: `${protocol}://${hostname}:${PORT}/uploads/${filename}`,
  });
});

app.get('/', (_req, res) => res.sendFile(
  path.join(__dirname, '..', 'public', 'upload.html'),
));

app.use('/uploads', express.static(uploadsPath));
app.use('/uploads', serveIndex(uploadsPath));

app.listen(PORT, () =>
  console.log(`Running in ${PORT}`),
);
