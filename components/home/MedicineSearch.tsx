"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { debounce } from "lodash";
import Link from 'next/link';
import { 
  TextField, 
  InputAdornment, 
  CircularProgress, 
  List, 
  ListItem, 
  Typography, 
  Paper, 
  Box, 
  IconButton,
  Chip
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CancelIcon from '@mui/icons-material/Cancel';

interface MedicineData {
  id: Id<"medicine_data">;
  name: string;
  category: string;
  manufacturer: string;
  mrp: number;
  discount: number;
  stock_quantity: number;
  prescription_required: string;
}

export default function MedicineSearch({ 
  onSelect 
}: { 
  onSelect?: (medicine: MedicineData) => void 
}) {
  // Remove unused router variable
  // const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<MedicineData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const highlightedItemRef = useRef<HTMLLIElement>(null);

  // Fix useCallback dependency warning by adding proper dependencies
  const debouncedSetSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearchTerm(value);
    }, 300),
    [/* No dependencies needed for this function */]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSetSearch(value);
    
    if (value.trim() === "") {
      setIsOpen(false);
    }
  };

  const medicineResults = useQuery(api.medicine.searchMedicines, {
    searchQuery: debouncedSearchTerm,
    limit: 10,
  });

  useEffect(() => {
    if (debouncedSearchTerm.trim() === "") {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    if (medicineResults) {
      setSuggestions(medicineResults);
      setIsOpen(true);
      setIsLoading(false);
    }
  }, [medicineResults, debouncedSearchTerm]);

  useEffect(() => {
    if (highlightedIndex >= 0 && highlightedItemRef.current) {
      highlightedItemRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      });
    }
  }, [highlightedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;
    
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSuggestionClick(suggestions[highlightedIndex]);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        inputRef.current?.blur();
        break;
      case "Tab":
        setIsOpen(false);
        break;
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSuggestionClick = (medicine: MedicineData) => {
    console.log("Selected Medicine:", medicine);
    console.log("Medicine ID:", medicine.id);
    
    setSearchTerm(medicine.name);
    setIsOpen(false);
    setHighlightedIndex(-1);
    
    if (onSelect) {
      onSelect(medicine);
    } else {
      // For navigation, we'll let the Link component handle it
      // The actual navigation happens in the render via Link
      const medicineIdString = String(medicine.id);
      console.log("Preparing navigation to:", medicineIdString);
      
      // Create a link element and click it programmatically
      const linkElement = document.createElement('a');
      linkElement.href = `/medicine/${encodeURIComponent(medicineIdString)}`;
      linkElement.click();
    }
    
    inputRef.current?.blur();
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(price);
  };

  const calculateDiscountedPrice = (mrp: number, discountDecimal: number) => {
    return mrp - (mrp * discountDecimal);
  };

  const formatDiscountPercentage = (discountDecimal: number) => {
    return Math.round(discountDecimal * 100);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setSuggestions([]);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <TextField
        inputRef={inputRef}
        fullWidth
        value={searchTerm}
        onChange={handleSearchChange}
        onKeyDown={handleKeyDown}
        onFocus={() => debouncedSearchTerm.trim() !== "" && suggestions.length > 0 && setIsOpen(true)}
        placeholder="Search medicines..."
        variant="outlined"
        size="medium"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {isLoading && searchTerm ? (
                <CircularProgress size={20} />
              ) : searchTerm ? (
                <IconButton
                  edge="end"
                  onClick={clearSearch}
                  aria-label="Clear search"
                  size="small"
                >
                  <CancelIcon fontSize="small" />
                </IconButton>
              ) : null}
            </InputAdornment>
          ),
          sx: {
            borderRadius: '9999px',
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'rgba(0, 0, 0, 0.1)'
            }
          }
        }}
      />

      {isOpen && suggestions.length > 0 && (
        <Paper
          ref={suggestionsRef}
          elevation={4}
          sx={{
            position: 'absolute',
            zIndex: 50,
            mt: 1,
            width: '100%',
            maxHeight: 320,
            overflow: 'auto',
            borderRadius: 2,
            bgcolor: 'rgba(255, 255, 255, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.3)'
          }}
        >
          <List disablePadding>
            {suggestions.map((medicine, index) => {
              const isHighlighted = index === highlightedIndex;
              const discountedPrice = calculateDiscountedPrice(medicine.mrp, medicine.discount);
              
              // Determine availability based on stock_quantity
              const availability = medicine.stock_quantity > 0 ? 'In Stock' : 'Out of Stock';
              
              return (
                <ListItem
                  key={medicine.id}
                  onClick={() => handleSuggestionClick(medicine)}
                  disablePadding
                  sx={{
                    cursor: 'pointer',
                    bgcolor: isHighlighted ? 'rgba(25, 118, 210, 0.1)' : 'transparent',
                    '&:hover': {
                      bgcolor: 'rgba(25, 118, 210, 0.08)'
                    },
                    borderBottom: '1px solid',
                    borderColor: 'rgba(0, 0, 0, 0.08)'
                  }}
                  ref={isHighlighted ? highlightedItemRef : null}
                >
                  <Box 
                    component={Link}
                    href={`/medicine/${encodeURIComponent(String(medicine.id))}`}
                    sx={{ 
                      width: '100%', 
                      textDecoration: 'none', 
                      color: 'text.primary',
                      py: 1.5,
                      px: 2
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2 }}>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography 
                          variant="subtitle2" 
                          color="text.primary"
                          sx={{ 
                            fontWeight: 500,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {medicine.name}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          color="text.secondary" 
                          sx={{ 
                            mt: 0.5,
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          {medicine.manufacturer} • {medicine.category}
                          {medicine.prescription_required === "Yes" && " • Rx"}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: 'right', flexShrink: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          <Typography 
                            variant="caption" 
                            color="text.secondary" 
                            sx={{ textDecoration: 'line-through', mr: 0.5 }}
                          >
                            {formatPrice(medicine.mrp)}
                          </Typography>
                          <Typography variant="body2" color="success.main" fontWeight="medium">
                            {formatPrice(discountedPrice)}
                          </Typography>
                        </Box>
                        {medicine.discount > 0 && (
                          <Typography variant="caption" color="primary" sx={{ fontWeight: 500 }}>
                            {formatDiscountPercentage(medicine.discount)}% off
                          </Typography>
                        )}
                        <Box sx={{ mt: 0.5 }}>
                          <Chip
                            label={availability}
                            size="small"
                            color={medicine.stock_quantity > 0 ? 'success' : 'error'}
                            sx={{ 
                              height: 20, 
                              fontSize: '0.625rem',
                              '& .MuiChip-label': { px: 1 }
                            }}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </ListItem>
              );
            })}
          </List>
        </Paper>
      )}
      
      {isOpen && searchTerm && suggestions.length === 0 && !isLoading && (
        <Paper 
          elevation={4}
          sx={{
            position: 'absolute',
            zIndex: 50,
            mt: 1,
            width: '100%',
            p: 2,
            textAlign: 'center',
            borderRadius: 2,
            bgcolor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: 'white'
          }}
        >
          <Typography variant="body2" color="inherit">
            No medicines found matching "{searchTerm}"
          </Typography>
          <Typography variant="caption" color="rgba(255, 255, 255, 0.7)" sx={{ mt: 0.5, display: 'block' }}>
            Try a different search term
          </Typography>
        </Paper>
      )}
    </Box>
  );
}