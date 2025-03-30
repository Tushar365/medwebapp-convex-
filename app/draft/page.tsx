"use client";

import { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  CardActions,
  Button,
  Grid,
  Divider,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MedicationIcon from '@mui/icons-material/Medication';
import Header from '@/components/HeaderComponent';
import Footer from '@/components/FooterComponent';
import { useRouter } from 'next/navigation';

interface DraftOrder {
  id: string;
  title: string;
  date: string;
  items: number;
  medicines: Array<{
    name: string;
    quantity: number;
  }>;
}

// Sample data - this would come from your database in a real app
const sampleDrafts: DraftOrder[] = [
  { 
    id: 'DFT-001', 
    title: 'Monthly Prescription',
    date: '2023-11-15', 
    items: 3,
    medicines: [
      { name: 'Metformin 500mg', quantity: 30 },
      { name: 'Lisinopril 10mg', quantity: 30 },
      { name: 'Aspirin 81mg', quantity: 60 }
    ]
  },
  { 
    id: 'DFT-002', 
    title: 'First Aid Kit Refill',
    date: '2023-11-10', 
    items: 4,
    medicines: [
      { name: 'Bandages (Pack of 10)', quantity: 2 },
      { name: 'Antiseptic Solution', quantity: 1 },
      { name: 'Pain Relief Gel', quantity: 1 },
      { name: 'Paracetamol 500mg', quantity: 20 }
    ]
  },
  { 
    id: 'DFT-003', 
    title: 'Travel Medicine Kit',
    date: '2023-10-28', 
    items: 5,
    medicines: [
      { name: 'Motion Sickness Pills', quantity: 10 },
      { name: 'Antihistamine', quantity: 10 },
      { name: 'Loperamide', quantity: 6 },
      { name: 'Paracetamol 500mg', quantity: 10 },
      { name: 'Rehydration Salts', quantity: 5 }
    ]
  }
];

export default function DraftPage() {
  const [drafts, setDrafts] = useState<DraftOrder[]>(sampleDrafts);
  const [loading, setLoading] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<DraftOrder | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();

  const handleDeleteDraft = (id: string) => {
    setDrafts(drafts.filter(draft => draft.id !== id));
  };

  const handleEditDraft = (id: string) => {
    // In a real app, this would navigate to the order form with the draft data
    console.log(`Edit draft: ${id}`);
    router.push(`/order?draft=${id}`);
  };

  const handleContinueOrder = (id: string) => {
    // In a real app, this would navigate to the order form with the draft data
    console.log(`Continue with draft: ${id}`);
    router.push(`/order?draft=${id}`);
  };

  const viewDraftDetails = (id: string) => {
    const draft = drafts.find(d => d.id === id);
    if (draft) {
      setSelectedDraft(draft);
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <Box sx={{ flexGrow: 1, pt: 10, pb: 6 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Button 
              onClick={() => router.back()}
              sx={{ minWidth: 'auto', mr: 2 }}
            >
              ← Back
            </Button>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
              Saved Drafts
            </Typography>
          </Box>
          
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : drafts.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {drafts.map((draft) => (
                <Paper 
                  key={draft.id} 
                  elevation={1}
                  sx={{ p: 3, borderRadius: 2 }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'medium' }}>
                      {draft.title}
                    </Typography>
                    <Box>
                      <Button 
                        size="small" 
                        startIcon={<EditIcon />}
                        onClick={() => handleEditDraft(draft.id)}
                        sx={{ mr: 1 }}
                      >
                        Edit
                      </Button>
                      <Button 
                        size="small" 
                        color="error"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDeleteDraft(draft.id)}
                      >
                        Delete
                      </Button>
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 3, mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      Saved on {new Date(draft.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {draft.items} {draft.items === 1 ? 'item' : 'items'}
                    </Typography>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ mb: 2 }}>
                    {draft.medicines.map((medicine, index) => (
                      <Box key={index} sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        py: 0.5
                      }}>
                        <Typography variant="body2">{medicine.name}</Typography>
                        <Typography variant="body2">Qty: {medicine.quantity}</Typography>
                      </Box>
                    ))}
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button 
                      variant="contained" 
                      onClick={() => handleContinueOrder(draft.id)}
                    >
                      Continue Order
                    </Button>
                  </Box>
                </Paper>
              ))}
            </Box>
          ) : (
            <Paper 
              elevation={0} 
              variant="outlined" 
              sx={{ 
                p: 4, 
                textAlign: 'center',
                borderRadius: 2
              }}
            >
              <Typography variant="h6" sx={{ mb: 2 }}>
                No Saved Drafts
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                You don't have any saved drafts. Start a new order and save it as a draft to continue later.
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => router.push('/order')}
              >
                Start New Order
              </Button>
            </Paper>
          )}
        </Container>
      </Box>
      
      {/* Draft Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        {selectedDraft && (
          <>
            <DialogTitle>
              <Typography variant="h6">{selectedDraft.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                Draft ID: {selectedDraft.id}
              </Typography>
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="subtitle2" gutterBottom>
                Saved on {new Date(selectedDraft.date).toLocaleDateString()}
              </Typography>
              
              <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: 'medium' }}>
                Items in this draft:
              </Typography>
              
              <Paper variant="outlined" sx={{ p: 2 }}>
                {selectedDraft.medicines.map((medicine, index) => (
                  <Box key={index} sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    py: 1,
                    borderBottom: index < selectedDraft.medicines.length - 1 ? '1px solid' : 'none',
                    borderColor: 'divider'
                  }}>
                    <Typography variant="body2">{medicine.name}</Typography>
                    <Typography variant="body2">Qty: {medicine.quantity}</Typography>
                  </Box>
                ))}
              </Paper>
            </DialogContent>
            <DialogActions>
              <Button 
                onClick={() => {
                  handleCloseDialog();
                  handleDeleteDraft(selectedDraft.id);
                }}
                color="error"
              >
                Delete Draft
              </Button>
              <Button onClick={handleCloseDialog}>Close</Button>
              <Button 
                variant="contained"
                onClick={() => {
                  handleCloseDialog();
                  handleContinueOrder(selectedDraft.id);
                }}
              >
                Continue Order
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      <Footer />
    </Box>
  );
}