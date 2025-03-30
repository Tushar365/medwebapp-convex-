// components/order/CartSection.tsx
import React from 'react'
import { 
  TableContainer, 
  Table, 
  TableHead, 
  TableBody, 
  TableRow, 
  TableCell, 
  Paper, 
  Box, 
  Typography, 
  IconButton,
  Chip
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { Id } from '@/convex/_generated/dataModel'

interface MedicineItem {
  id: Id<"medicine_data">;
  name: string;
  price: number;
  quantity: number;
  prescription_required: string;
}

interface CartSectionProps {
  cartItems: MedicineItem[];
  onRemoveItem: (id: Id<"medicine_data">) => void;
  onUpdateQuantity: (id: Id<"medicine_data">, quantity: number) => void;
}

const CartSection: React.FC<CartSectionProps> = ({
  cartItems,
  onRemoveItem,
  onUpdateQuantity
}) => {
  return (
    <>
      {cartItems.length > 0 ? (
        <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Medicine</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cartItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      {item.name}
                      {item.prescription_required === "Yes" && (
                        <Chip size="small" label="Prescription Required" color="warning" sx={{ mt: 0.5, width: 'fit-content' }} />
                      )}
                    </Box>
                  </TableCell>
                  <TableCell align="right">₹{item.price.toFixed(2)}</TableCell>
                  <TableCell align="right">{item.quantity}</TableCell>
                  <TableCell align="right">₹{(item.price * item.quantity).toFixed(2)}</TableCell>
                  <TableCell align="right">
                    <IconButton 
                      size="small" 
                      color="error"
                      onClick={() => onRemoveItem(item.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={{ textAlign: 'center', py: 4, bgcolor: 'rgba(0, 0, 0, 0.02)', borderRadius: 1 }}>
          <Typography color="text.secondary">
            Your cart is empty. Search and add medicines above.
          </Typography>
        </Box>
      )}
    </>
  )
}

export default CartSection