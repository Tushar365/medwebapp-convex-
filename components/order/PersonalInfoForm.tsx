// components/order/PersonalInfoForm.tsx
import React from 'react'
import { 
  TextField, 
  Stack, 
  FormControl, 
  FormLabel, 
  InputAdornment,
  Select,
  MenuItem,
  Box,
  Typography,
  Chip
} from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import { SelectChangeEvent } from '@mui/material/Select'

interface PersonalInfo {
  name: string;
  age: string;
  gender: string;
  phone: string;
  location: string;
  address: string;
}

interface PersonalInfoFormProps {
  personalInfo: PersonalInfo;
  onInfoChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => void;
  locations: string[];
  prescription: File | null;
  prescriptionRequired: boolean;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errorMessage: string;
}

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({
  personalInfo,
  onInfoChange,
  locations,
  prescription,
  prescriptionRequired,
  fileInputRef,
  onFileUpload,
  errorMessage
}) => {
  return (
    <Stack spacing={2}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <FormControl fullWidth>
          <FormLabel htmlFor="name" sx={{ mb: 0.5, fontWeight: 500, fontSize: '0.875rem' }}>Full Name</FormLabel>
          <TextField
            id="name"
            name="name"
            value={personalInfo.name}
            onChange={onInfoChange}
            required
            variant="outlined"
            placeholder="Enter your full name"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
        
        <FormControl sx={{ width: { xs: '100%', sm: '30%' } }}>
          <FormLabel htmlFor="age" sx={{ mb: 0.5, fontWeight: 500, fontSize: '0.875rem' }}>Age</FormLabel>
          <TextField
            id="age"
            name="age"
            value={personalInfo.age}
            onChange={onInfoChange}
            type="number"
            variant="outlined"
            placeholder="Age"
            size="small"
            InputProps={{ inputProps: { min: 0, max: 120 } }}
          />
        </FormControl>
      </Stack>
      
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <FormControl fullWidth>
          <FormLabel htmlFor="gender" sx={{ mb: 0.5, fontWeight: 500, fontSize: '0.875rem' }}>Gender</FormLabel>
          <Select
            id="gender"
            name="gender"
            value={personalInfo.gender}
            onChange={onInfoChange}
            displayEmpty
            size="small"
          >
            <MenuItem value="" disabled>Select gender</MenuItem>
            <MenuItem value="Male">Male</MenuItem>
            <MenuItem value="Female">Female</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>
        
        <FormControl fullWidth>
          <FormLabel htmlFor="phone" sx={{ mb: 0.5, fontWeight: 500, fontSize: '0.875rem' }}>Phone Number</FormLabel>
          <TextField
            id="phone"
            name="phone"
            value={personalInfo.phone}
            onChange={onInfoChange}
            required
            variant="outlined"
            placeholder="Enter your phone number"
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PhoneIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </FormControl>
      </Stack>
      
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="flex-start">
        <Stack spacing={2} sx={{ width: '100%' }}>
          <FormControl fullWidth>
            <FormLabel htmlFor="location" sx={{ mb: 0.5, fontWeight: 500, fontSize: '0.875rem' }}>Location</FormLabel>
            <Select
              id="location"
              name="location"
              value={personalInfo.location}
              onChange={onInfoChange}
              required
              displayEmpty
              size="small"
              startAdornment={
                <InputAdornment position="start">
                  <LocationOnIcon fontSize="small" />
                </InputAdornment>
              }
            >
              <MenuItem value="" disabled>Select location</MenuItem>
              {locations.map(location => (
                <MenuItem key={location} value={location}>{location}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth>
            <FormLabel htmlFor="address" sx={{ mb: 0.5, fontWeight: 500, fontSize: '0.875rem' }}>Delivery Address</FormLabel>
            <TextField
              id="address"
              name="address"
              value={personalInfo.address}
              onChange={onInfoChange}
              required
              variant="outlined"
              placeholder="Enter delivery address"
              size="small"
              multiline
              rows={2}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                    <LocationOnIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
        </Stack>
        
        <FormControl sx={{ width: { xs: '100%', sm: '30%' } }}>
          <FormLabel htmlFor="prescription" sx={{ mb: 0.5, fontWeight: 500, fontSize: '0.875rem' }}>
            Upload Prescription {prescriptionRequired && <Chip size="small" color="warning" label="Required" sx={{ ml: 1 }} />}
          </FormLabel>
          <Box 
            sx={{ 
              border: '1px dashed',
              borderColor: prescriptionRequired ? 'warning.main' : 'divider',
              borderRadius: 1,
              p: 1.5,
              textAlign: 'center',
              cursor: 'pointer',
              height: '100%',
              minHeight: '100px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.02)' },
              bgcolor: prescriptionRequired && !prescription ? 'rgba(255, 152, 0, 0.05)' : 'transparent'
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              accept="image/*,.pdf"
              onChange={onFileUpload}
            />
            <FileUploadIcon sx={{ fontSize: 20, color: prescriptionRequired ? 'warning.main' : 'primary.main', mb: 0.5 }} />
            <Typography variant="caption" noWrap>
              {prescription ? prescription.name : 'Upload prescription'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              JPG, PNG, PDF (Max: 5MB)
            </Typography>
            {errorMessage && (
              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                {errorMessage}
              </Typography>
            )}
          </Box>
        </FormControl>
      </Stack>
    </Stack>
  )
}

export default PersonalInfoForm