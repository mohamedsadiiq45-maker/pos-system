import {
  Typography,
  Box,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  InputAdornment,
  Chip,
  Tooltip,
  Avatar,
  Alert,
  Snackbar,
  CircularProgress,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Image as ImageIcon,
  Visibility as ViewIcon,
  ContentCopy as CopyIcon,
  MoreVert as MoreIcon,
  Storage as StorageIcon,
  PhotoLibrary as GalleryIcon,
  Download as DownloadIcon,
  ZoomIn as ZoomInIcon,
  Close as CloseIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { useEffect, useState } from 'react';

interface MediaFile {
  id: string;
  filename: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
}

function MediaPage() {
  const [media, setMedia] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuMedia, setMenuMedia] = useState<MediaFile | null>(null);
  const [stats, setStats] = useState({ totalFiles: 0, totalSize: 0 });
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetchMedia();
    fetchStats();
  }, []);

  const fetchMedia = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/media', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMedia(data);
      }
    } catch (error) {
      console.error('Failed to fetch media:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/media/stats', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    let successCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('image', file);

      try {
        const response = await fetch('http://localhost:3001/api/upload', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });

        if (response.ok) {
          successCount++;
        }
      } catch (error) {
        console.error('Failed to upload file:', file.name);
      }
    }

    setUploading(false);
    setUploadDialogOpen(false);
    
    if (successCount > 0) {
      setSnackbar({ open: true, message: `${successCount} file(s) uploaded successfully!`, severity: 'success' });
      fetchMedia();
      fetchStats();
    } else {
      setSnackbar({ open: true, message: 'Failed to upload files', severity: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!selectedMedia) return;

    try {
      const response = await fetch(`http://localhost:3001/api/media/${selectedMedia.filename}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        setSnackbar({ open: true, message: 'File deleted successfully!', severity: 'success' });
        setMedia(media.filter((m) => m.id !== selectedMedia.id));
        fetchStats();
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      setSnackbar({ open: true, message: 'Failed to delete file', severity: 'error' });
    }
    setDeleteDialogOpen(false);
    setSelectedMedia(null);
  };

  const handleCopyUrl = (file: MediaFile) => {
    const fullUrl = `http://localhost:3001${file.url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedId(file.id);
    setTimeout(() => setCopiedId(null), 2000);
    setSnackbar({ open: true, message: 'URL copied to clipboard!', severity: 'success' });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const filteredMedia = media.filter((file) =>
    file.filename.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, file: MediaFile) => {
    setAnchorEl(event.currentTarget);
    setMenuMedia(file);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuMedia(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight="bold">
            Media Library
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Dashboard • Media
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="warning"
          startIcon={<UploadIcon />}
          onClick={() => setUploadDialogOpen(true)}
        >
          Upload Media
        </Button>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2.5, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'primary.light', width: 56, height: 56 }}>
                <GalleryIcon sx={{ color: 'primary.main', fontSize: 28 }} />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Total Files
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {stats.totalFiles}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2.5, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'warning.light', width: 56, height: 56 }}>
                <StorageIcon sx={{ color: 'warning.main', fontSize: 28 }} />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Storage Used
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {formatFileSize(stats.totalSize)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2.5, borderRadius: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar sx={{ bgcolor: 'success.light', width: 56, height: 56 }}>
                <ImageIcon sx={{ color: 'success.main', fontSize: 28 }} />
              </Avatar>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Showing
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {filteredMedia.length}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Search */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
        <TextField
          placeholder="Search media files..."
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ minWidth: 350 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      {/* Media Grid */}
      {filteredMedia.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <ImageIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No media files found
          </Typography>
          <Typography variant="body2" color="text.disabled" sx={{ mb: 2 }}>
            Upload your first image to get started
          </Typography>
          <Button
            variant="contained"
            color="warning"
            startIcon={<UploadIcon />}
            onClick={() => setUploadDialogOpen(true)}
          >
            Upload Media
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {filteredMedia.map((file) => (
            <Grid item xs={6} sm={4} md={3} lg={2} key={file.id}>
              <Card sx={{ borderRadius: 3, position: 'relative', overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={`http://localhost:3001${file.url}`}
                  alt={file.filename}
                  sx={{ 
                    objectFit: 'cover', 
                    cursor: 'pointer',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                  onClick={() => {
                    setSelectedMedia(file);
                    setViewDialogOpen(true);
                  }}
                />
                <CardContent sx={{ p: 1.5, pb: 0.5 }}>
                  <Typography variant="body2" noWrap fontWeight="500">
                    {file.filename}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {formatFileSize(file.size)}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 1, pt: 0, justifyContent: 'space-between' }}>
                  <Tooltip title={copiedId === file.id ? 'Copied!' : 'Copy URL'}>
                    <IconButton size="small" onClick={() => handleCopyUrl(file)}>
                      {copiedId === file.id ? (
                        <CheckIcon fontSize="small" color="success" />
                      ) : (
                        <CopyIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                  <IconButton size="small" onClick={(e) => handleMenuOpen(e, file)}>
                    <MoreIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          if (menuMedia) {
            setSelectedMedia(menuMedia);
            setViewDialogOpen(true);
          }
          handleMenuClose();
        }}>
          <ListItemIcon>
            <ViewIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          if (menuMedia) handleCopyUrl(menuMedia);
          handleMenuClose();
        }}>
          <ListItemIcon>
            <CopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy URL</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => {
            if (menuMedia) {
              window.open(`http://localhost:3001${menuMedia.url}`, '_blank');
            }
            handleMenuClose();
          }}
        >
          <ListItemIcon>
            <DownloadIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Download</ListItemText>
        </MenuItem>
        <MenuItem 
          onClick={() => {
            if (menuMedia) {
              setSelectedMedia(menuMedia);
              setDeleteDialogOpen(true);
            }
            handleMenuClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <ListItemIcon>
            <DeleteIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>

      {/* View Dialog */}
      <Dialog 
        open={viewDialogOpen} 
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" noWrap sx={{ maxWidth: '80%' }}>
            {selectedMedia?.filename}
          </Typography>
          <IconButton onClick={() => setViewDialogOpen(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {selectedMedia && (
            <Box>
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <img
                  src={`http://localhost:3001${selectedMedia.url}`}
                  alt={selectedMedia.filename}
                  style={{ maxWidth: '100%', maxHeight: 400, objectFit: 'contain', borderRadius: 8 }}
                />
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">File Name</Typography>
                  <Typography variant="body2">{selectedMedia.filename}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">File Size</Typography>
                  <Typography variant="body2">{formatFileSize(selectedMedia.size)}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Type</Typography>
                  <Typography variant="body2">{selectedMedia.type}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">Uploaded</Typography>
                  <Typography variant="body2">{formatDate(selectedMedia.uploadedAt)}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="caption" color="text.secondary">URL</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <TextField
                      size="small"
                      fullWidth
                      value={`http://localhost:3001${selectedMedia.url}`}
                      InputProps={{ readOnly: true }}
                    />
                    <Button
                      variant="outlined"
                      startIcon={<CopyIcon />}
                      onClick={() => handleCopyUrl(selectedMedia)}
                    >
                      Copy
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button 
            color="error" 
            startIcon={<DeleteIcon />}
            onClick={() => {
              setViewDialogOpen(false);
              setDeleteDialogOpen(true);
            }}
          >
            Delete
          </Button>
          <Button 
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={() => window.open(`http://localhost:3001${selectedMedia?.url}`, '_blank')}
          >
            Download
          </Button>
        </DialogActions>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onClose={() => !uploading && setUploadDialogOpen(false)}>
        <DialogTitle>Upload Media</DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            <Paper
              variant="outlined"
              sx={{
                p: 4,
                textAlign: 'center',
                borderStyle: 'dashed',
                borderRadius: 3,
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' },
              }}
              component="label"
            >
              <input
                type="file"
                multiple
                accept="image/*"
                hidden
                onChange={handleUpload}
                disabled={uploading}
              />
              {uploading ? (
                <>
                  <CircularProgress sx={{ mb: 2 }} />
                  <Typography>Uploading...</Typography>
                </>
              ) : (
                <>
                  <UploadIcon sx={{ fontSize: 48, color: 'warning.main', mb: 1 }} />
                  <Typography variant="body1" gutterBottom>
                    Click to upload or drag and drop
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    PNG, JPG, GIF, WebP up to 5MB
                  </Typography>
                </>
              )}
            </Paper>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setUploadDialogOpen(false)} disabled={uploading}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Media</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{selectedMedia?.filename}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            This action cannot be undone. If this image is used somewhere, it will no longer display.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleDelete} variant="contained" color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{ borderRadius: 2 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default MediaPage;

