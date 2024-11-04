const ytdl = require('ytdl-core');

module.exports = async (req, res) => {
  const { url, format } = req.query;

  // Check if URL is valid
  if (!ytdl.validateURL(url)) {
    return res.status(400).json({ error: 'Invalid YouTube URL' });
  }

  // Set the file name in the response header
  res.setHeader('Content-Disposition', `attachment; filename="video.${format}"`);

  // Stream the file in the specified format
  if (format === 'mp4') {
    ytdl(url, { format: 'mp4' }).pipe(res);
  } else if (format === 'mp3') {
    ytdl(url, { filter: 'audioonly', format: 'mp3' }).pipe(res);
  } else {
    res.status(400).json({ error: 'Invalid format' });
  }
};
