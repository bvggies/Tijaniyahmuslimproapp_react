import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  IconButton,
  Chip,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  Tooltip,
  CircularProgress,
  Divider,
  SelectChangeEvent,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  YouTube as YouTubeIcon,
  Tv as TvIcon,
  Refresh as RefreshIcon,
  OpenInNew as OpenInNewIcon,
} from '@mui/icons-material';
import {
  useMakkahLiveChannels,
  useCreateChannel,
  useUpdateChannel,
  useDeleteChannel,
  useToggleChannelStatus,
  useToggleChannelFeatured,
  useSeedChannels,
} from './hooks/useMakkahLive';
import { MakkahLiveChannel, CreateMakkahChannelDto } from '../../lib/api/endpoints';

const CHANNEL_TYPES = [
  { value: 'YOUTUBE_LIVE', label: 'YouTube Live Stream', icon: <YouTubeIcon /> },
  { value: 'TV_CHANNEL', label: 'TV Channel Website', icon: <TvIcon /> },
];

const CHANNEL_CATEGORIES = [
  { value: 'MAKKAH', label: 'Makkah', color: '#E91E63' },
  { value: 'MADINAH', label: 'Madinah', color: '#9C27B0' },
  { value: 'QURAN', label: 'Quran', color: '#2196F3' },
  { value: 'ISLAMIC', label: 'Islamic', color: '#4CAF50' },
  { value: 'NEWS', label: 'News', color: '#FF9800' },
  { value: 'EDUCATIONAL', label: 'Educational', color: '#00BCD4' },
];

const emptyFormData: CreateMakkahChannelDto = {
  title: '',
  titleArabic: '',
  subtitle: '',
  type: 'YOUTUBE_LIVE',
  category: 'MAKKAH',
  youtubeId: '',
  websiteUrl: '',
  logo: '📺',
  sortOrder: 0,
  isActive: true,
  isFeatured: false,
};

export default function MakkahLivePage() {
  const { data: channels, isLoading, error, refetch } = useMakkahLiveChannels();
  const createChannel = useCreateChannel();
  const updateChannel = useUpdateChannel();
  const deleteChannel = useDeleteChannel();
  const toggleStatus = useToggleChannelStatus();
  const toggleFeatured = useToggleChannelFeatured();
  const seedChannels = useSeedChannels();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<MakkahLiveChannel | null>(null);
  const [formData, setFormData] = useState<CreateMakkahChannelDto>(emptyFormData);

  const handleOpenDialog = (channel?: MakkahLiveChannel) => {
    if (channel) {
      setSelectedChannel(channel);
      setFormData({
        title: channel.title,
        titleArabic: channel.titleArabic || '',
        subtitle: channel.subtitle || '',
        type: channel.type,
        category: channel.category,
        youtubeId: channel.youtubeId || '',
        websiteUrl: channel.websiteUrl || '',
        logo: channel.logo || '📺',
        sortOrder: channel.sortOrder,
        isActive: channel.isActive,
        isFeatured: channel.isFeatured,
      });
    } else {
      setSelectedChannel(null);
      setFormData(emptyFormData);
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedChannel(null);
    setFormData(emptyFormData);
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.title || formData.title.trim() === '') {
      alert('Please enter a title for the channel');
      return;
    }

    if (formData.type === 'YOUTUBE_LIVE' && (!formData.youtubeId || formData.youtubeId.trim() === '')) {
      alert('Please enter a YouTube Video ID');
      return;
    }

    if (formData.type === 'TV_CHANNEL' && (!formData.websiteUrl || formData.websiteUrl.trim() === '')) {
      alert('Please enter a website URL');
      return;
    }

    try {
      if (selectedChannel) {
        await updateChannel.mutateAsync({ id: selectedChannel.id, data: formData });
      } else {
        await createChannel.mutateAsync(formData);
      }
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving channel:', error);
      alert('Failed to save channel. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (selectedChannel) {
      try {
        await deleteChannel.mutateAsync(selectedChannel.id);
        setDeleteDialogOpen(false);
        setSelectedChannel(null);
      } catch (error) {
        console.error('Error deleting channel:', error);
      }
    }
  };

  const handleSeed = async () => {
    try {
      await seedChannels.mutateAsync();
    } catch (error) {
      console.error('Error seeding channels:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    return CHANNEL_CATEGORIES.find((c) => c.value === category)?.color || '#666';
  };

  const getCategoryLabel = (category: string) => {
    return CHANNEL_CATEGORIES.find((c) => c.value === category)?.label || category;
  };

  const youtubeChannels = channels?.filter((c) => c.type === 'YOUTUBE_LIVE') || [];
  const tvChannels = channels?.filter((c) => c.type === 'TV_CHANNEL') || [];

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Makkah Live Channels
          </Typography>
          <Typography color="text.secondary">
            Manage live streams and TV channel links
          </Typography>
        </Box>
        <Box display="flex" gap={2}>
          <Button
            variant="outlined"
            startIcon={<RefreshIcon />}
            onClick={() => refetch()}
          >
            Refresh
          </Button>
          {(!channels || channels.length === 0) && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleSeed}
              disabled={seedChannels.isPending}
            >
              {seedChannels.isPending ? 'Seeding...' : 'Seed Default Channels'}
            </Button>
          )}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Channel
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load channels. Please try again.
        </Alert>
      )}

      {/* YouTube Live Streams Section */}
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <YouTubeIcon color="error" />
        YouTube Live Streams ({youtubeChannels.length})
      </Typography>
      
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          },
          gap: 2,
          mb: 4,
        }}
      >
        {youtubeChannels.map((channel) => (
          <Box key={channel.id}>
            <ChannelCard
              channel={channel}
              onEdit={() => handleOpenDialog(channel)}
              onDelete={() => {
                setSelectedChannel(channel);
                setDeleteDialogOpen(true);
              }}
              onToggleStatus={() => toggleStatus.mutate(channel.id)}
              onToggleFeatured={() => toggleFeatured.mutate(channel.id)}
              getCategoryColor={getCategoryColor}
              getCategoryLabel={getCategoryLabel}
            />
          </Box>
        ))}
        {youtubeChannels.length === 0 && (
          <Box>
            <Alert severity="info">
              No YouTube live streams configured. Add one to get started.
            </Alert>
          </Box>
        )}
      </Box>

      <Divider sx={{ my: 4 }} />

      {/* TV Channels Section */}
      <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <TvIcon color="primary" />
        TV Channels ({tvChannels.length})
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(3, 1fr)',
          },
          gap: 2,
        }}
      >
        {tvChannels.map((channel) => (
          <Box key={channel.id}>
            <ChannelCard
              channel={channel}
              onEdit={() => handleOpenDialog(channel)}
              onDelete={() => {
                setSelectedChannel(channel);
                setDeleteDialogOpen(true);
              }}
              onToggleStatus={() => toggleStatus.mutate(channel.id)}
              onToggleFeatured={() => toggleFeatured.mutate(channel.id)}
              getCategoryColor={getCategoryColor}
              getCategoryLabel={getCategoryLabel}
            />
          </Box>
        ))}
        {tvChannels.length === 0 && (
          <Box>
            <Alert severity="info">
              No TV channels configured. Add one to get started.
            </Alert>
          </Box>
        )}
      </Box>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedChannel ? 'Edit Channel' : 'Add New Channel'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Title"
              value={formData.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, title: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Title (Arabic)"
              value={formData.titleArabic}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, titleArabic: e.target.value })}
              fullWidth
              dir="rtl"
            />
            <TextField
              label="Subtitle / Description"
              value={formData.subtitle}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, subtitle: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={formData.type}
                label="Type"
                onChange={(e: SelectChangeEvent<string>) => setFormData({ ...formData, type: e.target.value as any })}
              >
                {CHANNEL_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box display="flex" alignItems="center" gap={1}>
                      {type.icon}
                      {type.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={(e: SelectChangeEvent<string>) => setFormData({ ...formData, category: e.target.value as any })}
              >
                {CHANNEL_CATEGORIES.map((cat) => (
                  <MenuItem key={cat.value} value={cat.value}>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Box
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          backgroundColor: cat.color,
                        }}
                      />
                      {cat.label}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {formData.type === 'YOUTUBE_LIVE' && (
              <TextField
                label="YouTube Video ID"
                value={formData.youtubeId}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, youtubeId: e.target.value })}
                helperText="Enter only the video ID (e.g., dQw4w9WgXcQ from youtube.com/watch?v=dQw4w9WgXcQ)"
                fullWidth
              />
            )}

            {formData.type === 'TV_CHANNEL' && (
              <TextField
                label="Website URL"
                value={formData.websiteUrl}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, websiteUrl: e.target.value })}
                helperText="Full URL to the TV channel website"
                fullWidth
              />
            )}

            <TextField
              label="Logo (Emoji)"
              value={formData.logo}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, logo: e.target.value })}
              helperText="Use an emoji like 📺 or 🕋"
              fullWidth
            />

            <TextField
              label="Sort Order"
              type="number"
              value={formData.sortOrder}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
              helperText="Lower numbers appear first"
              fullWidth
            />

            <Box display="flex" gap={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isActive}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                }
                label="Active"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.isFeatured}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                }
                label="Featured"
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={createChannel.isPending || updateChannel.isPending}
          >
            {createChannel.isPending || updateChannel.isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Channel</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{selectedChannel?.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleDelete}
            disabled={deleteChannel.isPending}
          >
            {deleteChannel.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

interface ChannelCardProps {
  channel: MakkahLiveChannel;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
  onToggleFeatured: () => void;
  getCategoryColor: (category: string) => string;
  getCategoryLabel: (category: string) => string;
}

function ChannelCard({
  channel,
  onEdit,
  onDelete,
  onToggleStatus,
  onToggleFeatured,
  getCategoryColor,
  getCategoryLabel,
}: ChannelCardProps) {
  const isYoutube = channel.type === 'YOUTUBE_LIVE';

  return (
    <Card
      sx={{
        opacity: channel.isActive ? 1 : 0.6,
        border: channel.isFeatured ? '2px solid #FFD700' : undefined,
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Box display="flex" alignItems="center" gap={1}>
            <Typography variant="h6" component="span">
              {channel.logo || (isYoutube ? '📺' : '🌐')}
            </Typography>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" noWrap>
                {channel.title}
              </Typography>
              {channel.titleArabic && (
                <Typography variant="body2" color="text.secondary" dir="rtl">
                  {channel.titleArabic}
                </Typography>
              )}
            </Box>
          </Box>
          <Box display="flex" gap={0.5}>
            <Tooltip title={channel.isActive ? 'Hide' : 'Show'}>
              <IconButton size="small" onClick={onToggleStatus}>
                {channel.isActive ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title={channel.isFeatured ? 'Unfeature' : 'Feature'}>
              <IconButton size="small" onClick={onToggleFeatured}>
                {channel.isFeatured ? <StarIcon color="warning" /> : <StarBorderIcon />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        {channel.subtitle && (
          <Typography variant="body2" color="text.secondary" mb={1}>
            {channel.subtitle}
          </Typography>
        )}

        <Box display="flex" gap={1} mb={2} flexWrap="wrap">
          <Chip
            size="small"
            label={isYoutube ? 'YouTube' : 'Website'}
            icon={isYoutube ? <YouTubeIcon /> : <TvIcon />}
            color={isYoutube ? 'error' : 'primary'}
            variant="outlined"
          />
          <Chip
            size="small"
            label={getCategoryLabel(channel.category)}
            sx={{
              backgroundColor: getCategoryColor(channel.category) + '20',
              color: getCategoryColor(channel.category),
              borderColor: getCategoryColor(channel.category),
            }}
            variant="outlined"
          />
        </Box>

        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <Typography variant="caption" color="text.secondary">
            {isYoutube ? `ID: ${channel.youtubeId}` : channel.websiteUrl}
          </Typography>
          {!isYoutube && channel.websiteUrl && (
            <IconButton
              size="small"
              href={channel.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        <Box display="flex" justifyContent="flex-end" gap={1}>
          <Button size="small" startIcon={<EditIcon />} onClick={onEdit}>
            Edit
          </Button>
          <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={onDelete}>
            Delete
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}

