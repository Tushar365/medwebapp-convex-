"use client";

import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Button, 
  Chip, 
  CircularProgress,
  Alert,
  Divider,
  Stack
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DescriptionIcon from '@mui/icons-material/Description';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import FileUploadIcon from '@mui/icons-material/FileUpload';

export default function MedicineDetailInner({
  params
}: {
  params: { id: string }
}) {
  const routerParams = useParams();
  const router = useRouter();
  const id = params?.id || routerParams?.id as string;
  
  // Call useQuery unconditionally, but pass null/undefined when id is missing
  const medicineId = id ? (id as Id<"medicine_data">) : undefined;
  const medicine = useQuery(api.medicine.getMedicineById, 
    medicineId ? { id: medicineId } : { id: "" as Id<"medicine_data"> });
  
  const handleBack = () => {
    router.back();
  };
  
  // Now handle the missing ID case
  if (!id) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Missing medicine ID</Alert>
      </Container>
    );
  }
  
  if (!medicine) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
          Loading medicine details...
        </Typography>
      </Container>
    );
  }

  // Format price in Indian Rupees
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(price);
  };
  
  // Calculate discounted price
  const discountedPrice = medicine.mrp - (medicine.mrp * medicine.discount);
  
  // Format discount percentage
  const discountPercentage = Math.round(medicine.discount * 100);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Button 
          onClick={handleBack}
          startIcon={<ArrowBackIcon />}
          sx={{ minWidth: 'auto', px: 2 }}
        >
          Back
        </Button>
      </Box>
      
      <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4
        }}>
          {/* Image Section */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 40%' } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box 
                sx={{ 
                  position: 'relative', 
                  height: { xs: 250, md: 320 }, 
                  width: '100%', 
                  mb: 2,
                  bgcolor: 'grey.100',
                  borderRadius: 1,
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {medicine.image_url ? (
                  <Image 
                    src={medicine.image_url}
                    alt={medicine.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    priority
                    style={{ objectFit: 'contain' }}
                  />
                ) : (
                  <Image 
                    src="/medicine-pictures-2000-x-1500-yeqgtg000nqs48im.webp"
                    alt={medicine.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    priority
                    style={{ objectFit: 'contain' }}
                  />
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip 
                  label={medicine.stock_quantity > 0 ? "In Stock" : "Out of Stock"}
                  color={medicine.stock_quantity > 0 ? "success" : "error"}
                  icon={<LocalShippingIcon />}
                  variant="outlined"
                />
              </Box>
            </Box>
          </Box>
          
          {/* Medicine Details */}
          <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 60%' } }}>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
              {medicine.name}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
              Manufactured by <strong>{medicine.manufacturer}</strong>
            </Typography>
            
            {/* Remove the prescription information from here */}
            
            <Divider sx={{ my: 2 }} />
            
            {/* Price information */}
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}>
                <Typography variant="h5" component="p" fontWeight="600" color="primary.main">
                  {formatPrice(discountedPrice)}
                </Typography>
                {medicine.discount > 0 && (
                  <>
                    <Typography variant="body1" component="span" sx={{ textDecoration: 'line-through' }} color="text.secondary">
                      {formatPrice(medicine.mrp)}
                    </Typography>
                    <Chip 
                      label={`${discountPercentage}% OFF`} 
                      size="small" 
                      color="success"
                      sx={{ fontWeight: 'bold' }}
                    />
                  </>
                )}
              </Box>
              
              <Typography variant="caption" color="text.secondary">
                Inclusive of all taxes
              </Typography>
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            {/* Medicine details */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Product Details
              </Typography>
              
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
                  <Box sx={{ flex: '1 1 50%' }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Composition
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {medicine.composition || "Not specified"}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ flex: '1 1 50%' }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Expiry Date
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {medicine.expiry_date || "Not specified"}
                    </Typography>
                  </Box>
                </Box>
                
                {medicine.generic_alternative && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Generic Alternative
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {medicine.generic_alternative}
                    </Typography>
                  </Box>
                )}
                
                {/* Add prescription status at the end */}
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Prescription
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    {medicine.prescription_required === "Yes" ? "Required" : "Not Required"}
                  </Typography>
                </Box>
              </Stack>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}