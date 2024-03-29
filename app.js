const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const multiparty = require('multiparty');
const fs = require('fs');
const sharp = require('sharp');

const app = express();
const port = 3000;

mongoose.connect('mongodb+srv://dart-hit:qwerty123zxc34@cluster0.ap1ucz1.mongodb.net/rodrigo-bot', { useNewUrlParser: true, useUnifiedTopology: true });

const reviewSchema = new mongoose.Schema({
    file: String,
    text: String,
});

const Reviews = mongoose.model('reviews', reviewSchema);

const userSchema = new mongoose.Schema({
    firstName: String,
    username: String,
    chatId: String,
    directed: Boolean
});

const Users = mongoose.model('users', userSchema);

const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    next();
});

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }))
app.get('/', (req, res) => {
    res.sendFile(__dirname);
});

app.use('/uploads', express.static('uploads'));

app.post('/add', async (req, res) => {
    // var form = new multiparty.Form();

    // form.parse(req, async function (err, fields, files) {
    //     let file = files.file[0];

    //     if (file) {

    //         const buffer = fs.readFileSync(file.path);

    //         const maxFileSize = 125 * 1024; // 125 КБ в байтах

    //         if (buffer.length > maxFileSize) {
    //             const resizedBuffer = await sharp(buffer)
    //                 .resize({ fit: 'inside', width: 500 })
    //                 .toBuffer();

    //             if (resizedBuffer.length > maxFileSize) {
    //                 console.log("Error: File size still exceeds limit after resizing");
    //                 res.status(400).json({ error: 'Размер файла превышает 125КБ' });
    //                 return;
    //             }

    //             file.buffer = resizedBuffer;
    //         } else {
    //             file.buffer = 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Error-logo.png';
    //         }

    //         const newItem = new Reviews({
    //             file: file.buffer,
    //             text: '@kipikh',
    //         });

    //         await newItem.save();
    //         // res.json({ fileUrl: `/uploads/${btoa(String.fromCharCode.apply(null, new Uint8Array(newItem.file.data)))}` });
    //     }
    //     else {
    //         console.log("Error: File missing!")
    //     }
    // });

    const imageUrl = req.body.file; 
    const text = req.body.text;
    console.log(imageUrl);
    console.log(text);
    try {
        const newItem = new Reviews({
            file: imageUrl, 
            text: text, 
        });

        await newItem.save();
        return res.json({ message: 'Файл успешно сохранен' });
    } catch (error) {
        console.error('Ошибка при сохранении ссылки на фото', error);
        return res.status(500).json({ error: 'Произошла ошибка при сохранении ссылки на фото' });
    }

});

app.get('/items', async (req, res) => {
    try {
        const items = await Reviews.find({});
        res.json(items);
    } catch (err) {
        console.error(err);
        res.sendStatus(500);
    }
});

app.delete('/delete/:id', async (req, res) => {
    const itemId = req.params.id;
    try {
        await Reviews.findOneAndDelete({ _id: itemId });
        res.sendStatus(200);
    } catch (error) {
        console.error('Ошибка при удалении отзыва', error);
        res.sendStatus(500);
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await Users.find({});
        res.json(users);
    } catch (error) {
        console.error('Произошла ошибка при получении списка пользователей', error);
        res.sendStatus(500);
    }
});

app.delete('/deleteUser/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        await Users.findOneAndDelete({ _id: userId });
        res.sendStatus(200);
    } catch (error) {
        console.error('Произошла ошибка при удалении пользователя', error);
        res.sendStatus(500);
    }
});

app.listen(port, () => {
    console.log('Server is running');
});
