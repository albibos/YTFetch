const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const ytdl = require('ytdl-core');

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/public'));

io.on('connection', (socket) => {
    socket.on('fetchVideo', async (url) => {
        const info = await ytdl.getInfo(url);
        const format = ytdl.chooseFormat(info.formats, { quality: 'highest', filter: 'audioandvideo' });
        const videoUrl = format.url;

        socket.emit('videoInfo', {
            title: info.videoDetails.title,
            author: info.videoDetails.author,
            videoUrl,
        });
    });
});

server.listen(3000);