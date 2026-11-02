import url_Schema from '../models/url.model.js';
import { shortUrlserviceCustom, shortUrlserviceWithOutUser, shortUrlserviceWithUser } from '../services/shortUrl.service.js';

const formatShortUrl = (shortUrl) => {
  const base = process.env.APP_URL || `http://localhost:${process.env.PORT || 3000}/`;
  const cleanBase = base.endsWith('/') ? base : `${base}/`;
  return cleanBase + shortUrl;
};

export const shortUrlController = async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    const shortUrl = await shortUrlserviceWithOutUser(url);
    res.status(200).json({ shortUrl: formatShortUrl(shortUrl) });
  } catch (error) {
    console.error('Error saving URL:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const shortUrlWithUserController = async (req, res) => {
  const { url } = req.body;
  const userId = req.user?.userId;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User not found' });
  }

  try {
    const shortUrl = await shortUrlserviceWithUser(url, userId);
    res.status(200).json({ shortUrl: formatShortUrl(shortUrl) });
  } catch (error) {
    console.error('Error saving URL for user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const shortUrlCustomController = async (req, res) => {
  const { url, customId } = req.body;
  const userId = req.user?.userId;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized: User not found' });
  }
  try {
    url_Schema;
    const shortUrl = await shortUrlserviceCustom(url, userId, customId);
    res.status(200).json({ shortUrl: formatShortUrl(shortUrl) });
  } catch (error) {
    console.error('Error saving URL for user:', error);
    if (error.message.includes("already exists")) {
      return res.status(409).json({ message: error.message }); 
    }
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
