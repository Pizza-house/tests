const express = require('express');
const multer = require('multer');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Allow cross-origin requests
app.use(cors());
app.use(express.json());

// Serve images from /uploads
app.use('/uploads', express.static('uploads'));

// Multer setup for image uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Get menu data
app.get('/menu-data.json', (req, res) => {
    fs.readFile('menu-data.json', 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error reading menu data');
        res.type('json').send(data);
    });
});

// Save menu data
app.post('/menu-data.json', (req, res) => {
    fs.writeFile('menu-data.json', JSON.stringify(req.body, null, 2), err => {
        if (err) return res.status(500).send('Error saving menu data');
        res.send({ success: true });
    });
});

// Upload image
app.post('/upload', upload.single('image'), (req, res) => {
    res.json({ url: `/uploads/${req.file.filename}` });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
