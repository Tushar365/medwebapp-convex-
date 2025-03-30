// components/order/OrderSummary.tsx
import React from 'react'
import { 
  Box, 
  Typography, 
  Paper, 
  Stack, 
  Divider 
} from '@mui/material'

interface OrderSummaryProps {
  subtotal: number;
  discount: number;
  gst: number;
  total: number;
  discountRate: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  subtotal,
  discount,
  gst,
  total,
  discountRate
}) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      <Paper variant="outlined" sx={{ p: 2, borderRadius: 1 }}>
        <Stack spacing={1.5}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">Subtotal</Typography>
            <Typography variant="body2">₹{subtotal.toFixed(2)}</Typography>
          </Box>
          
          {subtotal >= 1000 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" color="success.main">
                Discount {subtotal >= 1500 ? '(4% off)' : '(2% off)'}
              </Typography>
              <Typography variant="body2" color="success.main">
                -₹{discount.toFixed(2)}
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2" color="text.secondary">GST (12%)</Typography>
            <Typography variant="body2">
              ₹{gst.toFixed(2)}
            </Typography>
          </Box>
          
          <Divider />
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="subtitle1" fontWeight="bold">Total Amount</Typography>
            <Typography variant="subtitle1" fontWeight="bold" color="primary.main">
              ₹{total.toFixed(2)}
            </Typography>
          </Box>
          
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
            * Prices are inclusive of all applicable taxes
          </Typography>
        </Stack>
      </Paper>
    </Box>
  )
}

export default OrderSummary