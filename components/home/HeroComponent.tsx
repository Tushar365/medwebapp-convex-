"use client";

import { useState } from 'react';
import Link from 'next/link';
import MedicineSearch from './MedicineSearch';
import { Id } from "../../convex/_generated/dataModel";
import { Box, Typography, Container, Button, Paper } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface MedicineData {
  id: Id<"medicine_data">;
  name: string;
  category: string;
  manufacturer: string;
  mrp: number;
}

export default function Hero() {
  // Add ESLint disable comment to suppress the unused variable warning
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineData | null>(null); // eslint-disable-line @typescript-eslint/no-unused-vars
  
  const handleMedicineSelect = (medicine: MedicineData) => {
    setSelectedMedicine(medicine);
  };
  
  return (
    <Box 
      component="section" 
      sx={{
        position: 'relative',
        minHeight: '100vh',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        pt: { xs: 8, md: 12 }
      }}
    >
      {/* Background with overlay */}
      <Box 
        sx={{
          position: 'absolute',
          inset: 0,
          backgroundImage: "url('/medications-1628372_1920.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(25, 42, 70, 0.8), rgba(40, 60, 90, 0.7))'
          }
        }}
      />
      
      <Container 
        sx={{ 
          px: { xs: 2, sm: 4 }, 
          py: { xs: 4, sm: 6 }, 
          position: 'relative', 
          zIndex: 10,
          height: '100vh',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Centered search and content */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: { xs: 2, sm: 3 },
          width: '100%', 
          maxWidth: '800px',
          mx: 'auto',
          flex: 1
        }}>
          {/* Search Box with enhanced styling */}
          <Box sx={{ 
            position: 'relative', 
            zIndex: 30,
            width: '100%',
            maxWidth: '600px',
            mb: { xs: 1, sm: 2 }
          }}>
            <MedicineSearch onSelect={handleMedicineSelect} />
          </Box>
          
          {/* Main content between search and button */}
          <Box sx={{ 
            width: '100%',
            textAlign: 'center',
            py: { xs: 2, sm: 3 },
            px: { xs: 2, sm: 4 },
            backdropFilter: 'blur(10px)',
            bgcolor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 4,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }}>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                color: 'white', 
                fontWeight: 'bold',
                mb: { xs: 1, sm: 2 },
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.5rem' },
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
              }}
            >
              Your Health, <Box component="span" sx={{ color: '#90caf9', background: 'linear-gradient(45deg, #90caf9, #64b5f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Our Priority</Box>
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                color: '#e5e7eb',
                mb: { xs: 2, sm: 3 },
                maxWidth: '500px',
                mx: 'auto',
                fontSize: { xs: '0.9rem', sm: '1rem' },
                lineHeight: 1.6
              }}
            >
              Search our extensive database of medicines, check prices, and place orders quickly. We deliver right to your doorstep.
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center',
              gap: 3,
              flexWrap: 'wrap',
              mt: 3
            }}>
              <Box sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.1)', 
                p: { xs: 2, sm: 3 }, 
                borderRadius: 3,
                textAlign: 'center',
                width: { xs: '100%', sm: '45%' },
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
                },
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
              }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 1, fontSize: { xs: '1rem', sm: '1.25rem' }, fontWeight: 600 }}>
                  Discount
                </Typography>
                <Typography variant="body2" sx={{ color: '#e5e7eb', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  Get your medicines up to
                </Typography>
                <Typography variant="h5" sx={{ 
                  color: '#4caf50', 
                  fontWeight: 'bold',
                  my: 1,
                  fontSize: { xs: '1.5rem', sm: '1.75rem' },
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.2)'
                }}>
                  20% OFF
                </Typography>
              </Box>
              
              <Box sx={{ 
                bgcolor: 'rgba(255, 255, 255, 0.1)', 
                p: { xs: 2, sm: 3 }, 
                borderRadius: 3,
                textAlign: 'center',
                width: { xs: '100%', sm: '45%' },
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
                },
                border: '1px solid rgba(255, 255, 255, 0.15)',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)'
              }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 1, fontSize: { xs: '1rem', sm: '1.25rem' }, fontWeight: 600 }}>
                  Genuine Products
                </Typography>
                <Typography variant="body2" sx={{ color: '#e5e7eb', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                  100% authentic medicines from authorized distributors
                </Typography>
              </Box>
            </Box>
          </Box>
          
          {/* Order Button */}
          <Button
            component={Link}
            href="/order"
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{ 
              px: { xs: 3, sm: 4 }, 
              py: { xs: 1.5, sm: 2 }, 
              borderRadius: 3,
              textTransform: 'none',
              fontSize: { xs: '1rem', sm: '1.1rem' },
              fontWeight: 600,
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
              background: 'linear-gradient(45deg, #1976d2, #42a5f5)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0, #1976d2)',
                boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)'
              },
              transition: 'all 0.3s',
              whiteSpace: 'nowrap',
              mt: { xs: 3, sm: 4 },
              minWidth: '180px'
            }}
          >
            Order Now
          </Button>
        </Box>
      </Container>
    </Box>
  );
}