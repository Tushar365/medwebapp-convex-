"use client";

import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  Avatar
} from '@mui/material';
import { 
  Inventory, 
  AttachMoney, 
  LocalOffer, 
  FlashOn, 
  VerifiedUser, 
  BarChart 
} from '@mui/icons-material';

export default function HomeComponent() {
  const features = [
    {
      icon: <Inventory />,
      title: "Large Medicine Stock",
      description: "Access our extensive inventory of over 50,000 medicines, ensuring you always find what you need."
    },
    {
      icon: <AttachMoney />,
      title: "Affordable Medicine",
      description: "Get the best prices on all medications with our competitive pricing and bulk purchase discounts."
    },
    {
      icon: <LocalOffer />,
      title: "Up to 20% Off",
      description: "Enjoy exclusive discounts of up to 20% on selected medicines and healthcare products."
    },
    {
      icon: <FlashOn />,
      title: "Quick Ordering",
      description: "Place orders quickly with our streamlined process and get medicines delivered to your doorstep."
    },
    {
      icon: <VerifiedUser />,
      title: "Trusted Genuine Products",
      description: "All our medicines are sourced from authorized distributors, ensuring authenticity and quality."
    },
    {
      icon: <BarChart />,
      title: "Analytics Dashboard",
      description: "Gain insights into your medicine usage patterns and optimize your inventory with our analytics tools."
    }
  ];

  return (
    <Box component="section" sx={{ py: 6, bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        {/* Section Title */}
        <Box sx={{ textAlign: 'center', mb: 5 }}>
          <Typography variant="h4" component="h2" gutterBottom fontWeight="bold" sx={{ color: '#000000' }}>
            Why Choose OsudhGhor
          </Typography>
          <Typography variant="subtitle1" sx={{ maxWidth: 600, mx: 'auto', color: '#000000' }}>
            We provide a comprehensive solution for medicine tracking and ordering
          </Typography>
        </Box>
        
        {/* Features */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          {features.map((feature, index) => (
            <Box 
              key={index}
              sx={{ 
                width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.333% - 16px)' },
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 3, 
                  height: '100%',
                  bgcolor: 'white',
                  borderRadius: 2
                }}
              >
                <Avatar 
                  sx={{ 
                    bgcolor: '#e3f2fd', 
                    color: '#1976d2',
                    mb: 2,
                    width: 48,
                    height: 48
                  }}
                >
                  {feature.icon}
                </Avatar>
                <Typography variant="h6" component="h3" gutterBottom sx={{ color: '#000000' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body2" sx={{ color: '#333333' }}>
                  {feature.description}
                </Typography>
              </Paper>
            </Box>
          ))}
        </Box>
      </Container>
    </Box>
  );
}