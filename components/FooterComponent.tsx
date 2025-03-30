"use client";

import Link from 'next/link';
import { Box, Container, Typography, Stack, Divider } from '@mui/material';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <Box component="footer" sx={{ bgcolor: '#f5f5f5', mt: 'auto', py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'center', md: 'flex-start' } }}>
          <Box sx={{ mb: { xs: 2, md: 0 } }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 500, color: 'text.primary' }}>
              OsudhGhor
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Your trusted medicine partner
            </Typography>
          </Box>
          
          <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
            <Link href="/" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                Home
              </Typography>
            </Link>
            <Link href="/orders" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                Orders
              </Typography>
            </Link>
            <Link href="/draft" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                Draft
              </Typography>
            </Link>
            <Link href="/account" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                Account
              </Typography>
            </Link>
            <Link href="/help" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                Help
              </Typography>
            </Link>
            <Link href="/terms" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                Terms
              </Typography>
            </Link>
            <Link href="/privacy" style={{ textDecoration: 'none' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', '&:hover': { color: 'primary.main' } }}>
                Privacy
              </Typography>
            </Link>
          </Stack>
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
          &copy; {currentYear} OsudhGhor. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}