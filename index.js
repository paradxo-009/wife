const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

let allVideos = [];
let videoIndex = 0;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function sendNextVideo(res) {
    const videoFile = allVideos[videoIndex];
    const videoPath = path.join('.', 'videos', videoFile);

    fs.readFile(videoPath, (err, data) => {
        if (err) {
            console.error('Error reading video file:', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        res.contentType('video/mp4').send(data);
        videoIndex = (videoIndex + 1) % allVideos.length; 
    });
}

app.get('/kshitiz', (req, res) => {
    if (allVideos.length === 0) {
        fs.readdir(path.join('.', 'videos'), (err, files) => {
            if (err) {
                console.error('Error reading videos folder:', err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }
            allVideos = files.filter(file => file.endsWith('.mp4') || file.endsWith('.avi') || file.endsWith('.mov'));
            shuffleArray(allVideos); 
            sendNextVideo(res);
        });
    } else {
        sendNextVideo(res);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
