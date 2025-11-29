import { Router } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

interface MediaFile {
  id: string;
  filename: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: Date;
}

// Get all media files
router.get('/', async (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, '../uploads');
    
    // Create uploads directory if it doesn't exist
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      return res.json([]);
    }

    const files = fs.readdirSync(uploadsDir);
    
    const mediaFiles: MediaFile[] = files
      .filter(file => {
        const ext = path.extname(file).toLowerCase();
        return ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'].includes(ext);
      })
      .map(file => {
        const filePath = path.join(uploadsDir, file);
        const stats = fs.statSync(filePath);
        const ext = path.extname(file).toLowerCase();
        
        let type = 'image';
        if (['.jpg', '.jpeg'].includes(ext)) type = 'image/jpeg';
        else if (ext === '.png') type = 'image/png';
        else if (ext === '.gif') type = 'image/gif';
        else if (ext === '.webp') type = 'image/webp';
        else if (ext === '.svg') type = 'image/svg+xml';

        return {
          id: file.replace(/\.[^/.]+$/, ''), // filename without extension as ID
          filename: file,
          url: `/uploads/${file}`,
          size: stats.size,
          type,
          uploadedAt: stats.mtime,
        };
      })
      .sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    res.json(mediaFiles);
  } catch (error) {
    console.error('Error fetching media files:', error);
    res.status(500).json({ message: 'Failed to fetch media files' });
  }
});

// Delete a media file
router.delete('/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = path.join(__dirname, '../uploads', filename);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    fs.unlinkSync(filePath);
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    console.error('Error deleting file:', error);
    res.status(500).json({ message: 'Failed to delete file' });
  }
});

// Get media stats
router.get('/stats', async (req, res) => {
  try {
    const uploadsDir = path.join(__dirname, '../uploads');
    
    if (!fs.existsSync(uploadsDir)) {
      return res.json({ totalFiles: 0, totalSize: 0 });
    }

    const files = fs.readdirSync(uploadsDir);
    let totalSize = 0;

    files.forEach(file => {
      const filePath = path.join(uploadsDir, file);
      const stats = fs.statSync(filePath);
      totalSize += stats.size;
    });

    res.json({
      totalFiles: files.length,
      totalSize,
    });
  } catch (error) {
    console.error('Error fetching media stats:', error);
    res.status(500).json({ message: 'Failed to fetch media stats' });
  }
});

export default router;

