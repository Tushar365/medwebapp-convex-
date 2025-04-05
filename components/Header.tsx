"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  Box, 
  Container 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LocalPharmacyIcon from '@mui/icons-material/LocalPharmacy';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add scroll event listener to change header appearance on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <AppBar 
      position="fixed" 
      elevation={scrolled ? 4 : 0}
      sx={{ 
        backgroundColor: 'white', 
        transition: 'all 0.3s',
        boxShadow: scrolled ? '0px 2px 10px rgba(0, 0, 0, 0.1)' : 'none'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ py: 0.5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
              <Box 
                component="img"
                src=""
                alt="OsudhGhor Logo"
                sx={{ 
                  height: 32, 
                  width: 32, 
                  mr: 1 
                }}
              />
              <Typography variant="h6" component="div" sx={{ fontWeight: 600, color: '#1976d2' }}>
                OsudhGhor
              </Typography>
            </Link>
          </Box>

          {/* Desktop Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            <Button 
              component={Link} 
              href="/order" 
              color="primary"
              variant="contained"
              sx={{ fontWeight: 'medium' }}
            >
              Order Now
            </Button>
            <Button 
              component={Link} 
              href="/orders" 
              color="inherit"
              startIcon={<ShoppingCartIcon />}
              sx={{ color: 'text.primary', '&:hover': { color: '#1976d2' } }}
            >
              Orders
            </Button>
            <Button 
              component={Link} 
              href="/draft" 
              color="inherit"
              startIcon={<DescriptionIcon />}
              sx={{ color: 'text.primary', '&:hover': { color: '#1976d2' } }}
            >
              Draft
            </Button>
            <Button 
              component={Link} 
              href="/account" 
              color="inherit"
              startIcon={<AccountCircleIcon />}
              sx={{ color: 'text.primary', '&:hover': { color: '#1976d2' } }}
            >
              Account
            </Button>
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            onClick={toggleMenu}
            sx={{ display: { xs: 'flex', md: 'none' }, color: 'text.primary' }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </Container>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="right"
        open={isMenuOpen}
        onClose={toggleMenu}
      >
        <Box sx={{ width: 250, pt: 2 }} role="presentation" onClick={toggleMenu}>
          <List>
            <ListItem 
              component={Link} 
              href="/order"
              sx={{ 
                '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' },
                backgroundColor: 'primary.main',
                color: 'white',
                mb: 1
              }}
            >
              <ListItemText primary="Order Now" />
            </ListItem>
            <ListItem 
              component={Link} 
              href="/orders"
              sx={{ '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' } }}
            >
              <ShoppingCartIcon sx={{ mr: 2, fontSize: '1.2rem', color: 'text.secondary' }} />
              <ListItemText primary="Orders" />
            </ListItem>
            <ListItem 
              component={Link} 
              href="/draft"
              sx={{ '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' } }}
            >
              <DescriptionIcon sx={{ mr: 2, fontSize: '1.2rem', color: 'text.secondary' }} />
              <ListItemText primary="Draft" />
            </ListItem>
            <ListItem 
              component={Link} 
              href="/account"
              sx={{ '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' } }}
            >
              <AccountCircleIcon sx={{ mr: 2, fontSize: '1.2rem', color: 'text.secondary' }} />
              <ListItemText primary="Account" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}