"use client";

import { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Tabs, 
  Tab, 
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  CircularProgress
} from '@mui/material';
import Header from '@/components/HeaderComponent';
import Footer from '@/components/FooterComponent';

interface Order {
  id: string;
  date: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
  total: number;
}

// Sample data - this would come from your API in a real app
const sampleOrders: Order[] = [
  { id: 'ORD-001', date: '2023-10-15', status: 'delivered', items: 3, total: 1250 },
  { id: 'ORD-002', date: '2023-11-02', status: 'shipped', items: 1, total: 450 },
  { id: 'ORD-003', date: '2023-11-10', status: 'processing', items: 2, total: 780 },
  { id: 'ORD-004', date: '2023-09-28', status: 'cancelled', items: 4, total: 1600 },
];

export default function OrdersPage() {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'processing': return 'warning';
      case 'shipped': return 'info';
      case 'delivered': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getFilteredOrders = () => {
    if (tabValue === 0) return sampleOrders;
    
    const statusMap = ['processing', 'shipped', 'delivered', 'cancelled'];
    return sampleOrders.filter(order => order.status === statusMap[tabValue - 1]);
  };

  const viewOrderDetails = (orderId: string) => {
    console.log(`View details for order: ${orderId}`);
    // Navigate to order details page
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <Box sx={{ flexGrow: 1, pt: 10, pb: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold' }}>
            My Orders
          </Typography>
          
          <Paper elevation={1} sx={{ borderRadius: 2, overflow: 'hidden' }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}
            >
              <Tab label="All Orders" />
              <Tab label="Processing" />
              <Tab label="Shipped" />
              <Tab label="Delivered" />
              <Tab label="Cancelled" />
            </Tabs>
            
            <Box sx={{ p: { xs: 1, sm: 2, md: 3 } }}>
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : getFilteredOrders().length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Items</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell align="right">Action</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {getFilteredOrders().map((order) => (
                        <TableRow key={order.id} hover>
                          <TableCell>{order.id}</TableCell>
                          <TableCell>
                            {/* Format date in a consistent way that doesn't depend on locale */}
                            {new Date(order.date).toISOString().split('T')[0]}
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={order.status.charAt(0).toUpperCase() + order.status.slice(1)} 
                              color={getStatusColor(order.status)}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>{order.items}</TableCell>
                          <TableCell>₹{order.total.toFixed(2)}</TableCell>
                          <TableCell align="right">
                            <Button 
                              size="small" 
                              variant="outlined"
                              onClick={() => viewOrderDetails(order.id)}
                            >
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant="body1" color="text.secondary">
                    No orders found in this category.
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  );
}