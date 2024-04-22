const express = require('express');
const bodyParser = require('body-parser');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const cors = require('cors'); // Import CORS middleware

const app = express();
const PORT = process.env.PORT || 5001; // Use port 5001 instead of 5000

const inputFilePath = 'input.mp4';
const outputFilePath = 'output.mp3';

app.use(cors()); // Enable CORS for all routes

app.use(bodyParser.json());

app.post('/convert', async (req, res) => {
    const { url } = req.body;

    console.log(url);

    try {
        // Download YouTube video
        const video = ytdl(url, { filter: 'audioonly' });
        console.log(video)

        const test = ffmpeg(video)
        .toFormat('mp3')

        console.log(test)
    
        // Convert to MP3 format and pipe the output to the response
        const ffmpegCommand = ffmpeg(video)
            .toFormat('mp3')
            .on('error', (err) => {
                console.error('Error converting video to MP3:', err);
                res.status(500).send('Error converting video to MP3');
            })
            .on('start', commandLine => {
                console.log('Spawned FFmpeg with command: ' + commandLine);
            });
    
        ffmpegCommand.pipe(res, { end: true });
    } catch (err) {
        console.error('Error downloading video:', err);
        res.status(500).send('Error downloading video');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
