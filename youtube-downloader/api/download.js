const ytdl = require('ytdl-core');

module.exports = async (req, res) => {
  try {
    const { url, format } = req.query;

    // Log the URL for debugging
    console.log('Received URL:', url);

    // Check if URL is valid
    if (!ytdl.validateURL(url)) {
      console.error('Invalid URL:', url);
      return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    // If using youtube shorts URL, ensure it’s treated correctly
    if (url.includes('youtube.com/shorts/')) {
      const videoId = url.split('/').pop().split('?')[0];
      url = `https://www.youtube.com/watch?v=${videoId}`;
    }

    // Set the file name in the response header
    res.setHeader('Content-Disposition', `attachment; filename="video.${format}"`);

    // Stream the file in the specified format
    if (format === 'mp4') {
      ytdl(url, { quality: 'highestvideo' }).pipe(res);
    } else if (format === 'mp3') {
      ytdl(url, { filter: 'audioonly' }).pipe(res);
    } else {
      console.error('Invalid format:', format);
      return res.status(400).json({ error: 'Invalid format' });
    }
  } catch (error) {
    console.error('Error occurred:', error);
    return res.status(500).json({ error: 'An error occurred while processing your request' });
  }
};
