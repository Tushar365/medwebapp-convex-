"use client";

import { Box, Container, Typography, Paper, Stack } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import SecurityIcon from '@mui/icons-material/Security';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const MedicinePage = () => {
  return (
    <Box sx={{ bgcolor: 'background.paper', py: 6, px: { xs: 2, sm: 3, md: 4 } }}>
      <Container maxWidth="lg">
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={4} 
          sx={{ width: '100%' }}
        >
          <Paper elevation={0} sx={{ p: 3, textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <VerifiedIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
              Genuine Products
            </Typography>
            <Typography variant="body2" color="text.secondary">
              All our medicines are sourced directly from authorized manufacturers and distributors.
            </Typography>
          </Paper>

          <Paper elevation={0} sx={{ p: 3, textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <SecurityIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
              Authentic Brands
            </Typography>
            <Typography variant="body2" color="text.secondary">
              We partner with trusted pharmaceutical brands to ensure quality and reliability.
            </Typography>
          </Paper>

          <Paper elevation={0} sx={{ p: 3, textAlign: 'center', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <LocalOfferIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 600 }}>
              Competitive Pricing
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Get the best value for your money with our competitive and transparent pricing.
            </Typography>
          </Paper>
        </Stack>
      </Container>
    </Box>
  );
};

export default MedicinePage;
