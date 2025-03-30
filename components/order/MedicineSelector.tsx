// components/order/MedicineSelector.tsx
import React from 'react'
import { 
  Stack, 
  Autocomplete, 
  TextField, 
  InputAdornment, 
  Button,
  Box,
  Typography,
  Chip
} from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'

interface MedicineSelectorProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: any[];
  selectedMedicine: any | null;
  setSelectedMedicine: (medicine: any | null) => void;
  quantity: string;
  setQuantity: (quantity: string) => void;
  onAddMedicine: () => void;
}

const MedicineSelector: React.FC<MedicineSelectorProps> = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  selectedMedicine,
  setSelectedMedicine,
  quantity,
  setQuantity,
  onAddMedicine
}) => {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
      <Autocomplete
        fullWidth
        options={searchResults || []}
        getOptionLabel={(option) => option.name}
        value={selectedMedicine}
        onChange={(_, newValue) => setSelectedMedicine(newValue)}
        inputValue={searchQuery}
        onInputChange={(_, newInputValue) => setSearchQuery(newInputValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search Medicines"
            variant="outlined"
            placeholder="Type to search medicines"
            InputProps={{
              ...params.InputProps,
              startAdornment: (
                <>
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                  {params.InputProps.startAdornment}
                </>
              )
            }}
          />
        )}
        renderOption={(props, option) => {
          // Extract the key from props to pass it directly
          const { key, ...otherProps } = props;
          return (
            <li key={key} {...otherProps}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography variant="body1">{option.name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    {option.manufacturer}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
                      ₹{option.mrp.toFixed(2)}
                    </Typography>
                    <Typography variant="caption" color="success.main" fontWeight="medium">
                      ₹{(option.mrp * (1 - option.discount)).toFixed(2)}
                    </Typography>
                  </Box>
                  {option.prescription_required === "Yes" && (
                    <Chip size="small" label="Rx" color="warning" sx={{ height: 16, fontSize: '0.6rem' }} />
                  )}
                </Box>
              </Box>
            </li>
          );
        }}
      />
      
      <TextField
        label="Quantity"
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        InputProps={{ inputProps: { min: 1 } }}
        sx={{ width: { xs: '100%', sm: '150px' } }}
      />
      
      <Button 
        variant="contained" 
        onClick={onAddMedicine}
        disabled={!selectedMedicine}
        sx={{ height: { sm: '56px' }, whiteSpace: 'nowrap' }}
      >
        Add to Cart
      </Button>
    </Stack>
  )
}

export default MedicineSelector