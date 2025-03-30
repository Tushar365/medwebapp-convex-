'use client'

import { useState } from 'react'
import { 
  Container, 
  Box, 
  Typography, 
  Paper, 
  Button, 
  TextField
} from '@mui/material'
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon
} from '@mui/icons-material'
import Header from '@/components/HeaderComponent'
import Footer from '@/components/FooterComponent'

export default function AccountPage() {
  const [isEditing, setIsEditing] = useState(false)
  
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+91 9876543210',
    gender: 'Male',
    age: 32,
    address: '123 Main Street, Mumbai, Maharashtra'
  })
  
  const [editableProfile, setEditableProfile] = useState({ ...userProfile })
  
  const handleEditToggle = () => {
    if (isEditing) {
      setEditableProfile({ ...userProfile })
    } else {
      setEditableProfile({ ...userProfile })
    }
    setIsEditing(!isEditing)
  }
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setEditableProfile(prev => ({
      ...prev,
      [name]: value
    }))
  }
  
  const handleSaveProfile = () => {
    setUserProfile({ ...editableProfile })
    setIsEditing(false)
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <Box sx={{ flexGrow: 1, py: 4 }}>
        <Container maxWidth="md">
          <Paper elevation={2} sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h5">Personal Information</Typography>
              <Button 
                startIcon={isEditing ? <CancelIcon /> : <EditIcon />}
                onClick={handleEditToggle}
                color={isEditing ? "error" : "primary"}
                variant="outlined"
                size="small"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </Box>
            
            {isEditing ? (
              <Box component="form">
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={editableProfile.name}
                    onChange={handleProfileChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={editableProfile.email}
                    onChange={handleProfileChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={editableProfile.phone}
                    onChange={handleProfileChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    multiline
                    rows={2}
                    value={editableProfile.address}
                    onChange={handleProfileChange}
                    sx={{ mb: 2 }}
                  />
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<SaveIcon />}
                    onClick={handleSaveProfile}
                  >
                    Save Changes
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Full Name</Typography>
                  <Typography variant="body1">{userProfile.name}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                  <Typography variant="body1">{userProfile.email}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                  <Typography variant="body1">{userProfile.phone}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                  <Typography variant="body1">{userProfile.address}</Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  )
}