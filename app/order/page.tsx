// app/order/page.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SelectChangeEvent } from '@mui/material/Select'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'

import Header from '@/components/HeaderComponent'
import Footer from '@/components/FooterComponent'
import PersonalInfoForm from '@/components/order/PersonalInfoForm'
import MedicineSelector from '@/components/order/MedicineSelector'
import CartSection from '@/components/order/CartSection'
import OrderSummary from '@/components/order/OrderSummary'
import { 
  Box, 
  Container, 
  IconButton, 
  Typography,
  Paper,
  Button
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

// Types
interface MedicineItem {
  id: Id<"medicine_data">;
  name: string;
  price: number;
  quantity: number;
  prescription_required: string;
}

interface PersonalInfo {
  name: string;
  age: string;
  gender: string;
  phone: string;
  location: string;
  address: string;
}

// Sample locations
const locations = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
];

export default function OrderPage() {
  const router = useRouter()
  // Change this line (around line 47)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // State
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    name: '',
    age: '',
    gender: '',
    phone: '',
    location: '',
    address: '',
  })
  
  const [prescription, setPrescription] = useState<File | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedMedicine, setSelectedMedicine] = useState<any | null>(null)
  const [quantity, setQuantity] = useState('1')
  const [cartItems, setCartItems] = useState<MedicineItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  
  // Convex query
  const searchResults = useQuery(api.medicine.searchMedicines, {
    searchQuery: searchQuery,
    limit: 10
  }) || []
  
  // Derived values
  const prescriptionRequired = cartItems.some(item => item.prescription_required === "Yes")
  
  // Pricing calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const discountRate = subtotal >= 1500 ? 0.04 : subtotal >= 1000 ? 0.02 : 0
  const discount = subtotal * discountRate
  const gst = (subtotal - discount) * 0.12
  const total = subtotal - discount + gst

  // Load draft data on component mount
  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem('medicineOrderDraft')
      if (savedDraft) {
        const draftData = JSON.parse(savedDraft)
        setPersonalInfo(draftData.personalInfo || personalInfo)
        setCartItems(draftData.items || [])
      }
    } catch (error) {
      console.error('Error loading draft data:', error)
    }
  }, [])
  
  // Handler functions
  const handlePersonalInfoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent
  ) => {
    const { name, value } = e.target as { name: string; value: unknown }
    setPersonalInfo(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('')
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrorMessage('File size exceeds 5MB limit')
        return
      }
      
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf']
      if (!validTypes.includes(file.type)) {
        setErrorMessage('Invalid file type. Please upload JPG, PNG, or PDF')
        return
      }
      
      setPrescription(file)
    }
  }
  
  const handleAddMedicine = () => {
    if (selectedMedicine && parseInt(quantity) > 0) {
      const existingItemIndex = cartItems.findIndex(item => item.id === selectedMedicine.id)
      
      if (existingItemIndex >= 0) {
        // Update quantity if medicine already in cart
        const updatedItems = [...cartItems]
        updatedItems[existingItemIndex].quantity += parseInt(quantity)
        setCartItems(updatedItems)
      } else {
        // Add new medicine to cart
        setCartItems([
          ...cartItems,
          {
            id: selectedMedicine.id,
            name: selectedMedicine.name,
            price: selectedMedicine.mrp * (1 - selectedMedicine.discount), // Calculate discounted price
            quantity: parseInt(quantity),
            prescription_required: selectedMedicine.prescription_required
          }
        ])
      }
      
      // Reset selection
      setSelectedMedicine(null)
      setSearchQuery('')
      setQuantity('1')
    }
  }
  
  const handleRemoveItem = (id: Id<"medicine_data">) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }
  
  const handleUpdateQuantity = (id: Id<"medicine_data">, newQuantity: number) => {
    if (newQuantity < 1) return
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    )
  }
  
  const handleSaveAsDraft = () => {
    try {
      // Prepare draft order data
      const draftOrderData = {
        personalInfo,
        items: cartItems,
        pricing: {
          subtotal,
          discount,
          gst,
          total
        },
        savedAt: new Date().toISOString()
      }
      
      // Save to localStorage
      localStorage.setItem('medicineOrderDraft', JSON.stringify(draftOrderData))
      
      // Show success message
      alert('Order saved as draft successfully!')
    } catch (error) {
      console.error('Error saving draft:', error)
      alert('Failed to save draft. Please try again.')
    }
  }
  
  // Validation
  const validatePhone = (phone: string) => {
    const phoneRegex = /^\d{10}$/
    return phoneRegex.test(phone)
  }
  
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      // Validate phone number
      if (!validatePhone(personalInfo.phone)) {
        alert('Please enter a valid 10-digit phone number')
        setIsLoading(false)
        return
      }
      
      // Validate prescription if required
      if (prescriptionRequired && !prescription) {
        alert('Please upload a prescription for prescription-required medicines')
        setIsLoading(false)
        return
      }
      
      // Handle prescription upload if present
      let prescriptionData = null
      if (prescription) {
        // Create a FormData object to upload the prescription
        const formData = new FormData()
        formData.append('file', prescription)
        
        // Upload the prescription to your storage service
        // This is a placeholder - replace with your actual upload logic
        const uploadResponse = await fetch('/api/upload-prescription', {
          method: 'POST',
          body: formData
        })
        
        if (!uploadResponse.ok) {
          throw new Error('Failed to upload prescription')
        }
        
        const uploadResult = await uploadResponse.json()
        prescriptionData = {
          name: prescription.name,
          url: uploadResult.url,
          type: prescription.type,
          size: prescription.size
        }
      }
      
      // Prepare order data
      const orderData = {
        personalInfo,
        prescription: prescriptionData,
        items: cartItems,
        pricing: {
          subtotal,
          discountRate,
          discount,
          gst,
          total
        },
        paymentMethod: 'COD', // Default payment method
        notes: '' // Optional notes
      }
      
      // Submit order to API
      const response = await fetch('/api/submit-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderData)
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to place order')
      }
      
      const result = await response.json()
      
      // Clear the draft after successful order
      localStorage.removeItem('medicineOrderDraft')
      
      // Store order ID in session for confirmation page
      sessionStorage.setItem('lastOrderId', result.orderId)
      
      // Redirect to confirmation page
      router.push('/order-confirmation')
    } catch (error: any) {
      console.error('Error submitting order:', error)
      alert(`Failed to place order: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      
      <Box sx={{ flexGrow: 1, pt: 10, pb: 6 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <IconButton 
              onClick={() => router.back()} 
              sx={{ mr: 1 }}
              aria-label="back"
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h5" fontWeight="bold">
              Place Your Order
            </Typography>
          </Box>
          
          <Box component="form" onSubmit={handleSubmitOrder} noValidate>
            {/* Personal Info Section */}
            <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>
                Personal Information
              </Typography>
              
              <PersonalInfoForm 
                personalInfo={personalInfo}
                onInfoChange={handlePersonalInfoChange}
                locations={locations}
                prescription={prescription}
                prescriptionRequired={prescriptionRequired}
                fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
                onFileUpload={handleFileUpload}
                errorMessage={errorMessage}
              />
            </Paper>
            
            {/* Medicine Selection Section */}
            <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 3, color: 'primary.main' }}>
                Add Medicines
              </Typography>
              
              <MedicineSelector 
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchResults={searchResults}
                selectedMedicine={selectedMedicine}
                setSelectedMedicine={setSelectedMedicine}
                quantity={quantity}
                setQuantity={setQuantity}
                onAddMedicine={handleAddMedicine}
              />
              
              <CartSection 
                cartItems={cartItems}
                onRemoveItem={handleRemoveItem}
                onUpdateQuantity={handleUpdateQuantity}
              />
              
              {/* Order Summary */}
              {cartItems.length > 0 && (
                <OrderSummary 
                  subtotal={subtotal}
                  discount={discount}
                  gst={gst}
                  total={total}
                  discountRate={discountRate}
                />
              )}
            </Paper>
            
            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
              <Button 
                variant="outlined"
                onClick={handleSaveAsDraft}
                disabled={cartItems.length === 0}
              >
                Save as Draft
              </Button>
              
              // Update the submit button to show loading state
              <Button 
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                disabled={
                  isLoading ||
                  cartItems.length === 0 || 
                  !personalInfo.name || 
                  !personalInfo.phone || 
                  !personalInfo.location ||
                  (prescriptionRequired && !prescription)
                }
                sx={{ 
                  px: 4, 
                  py: 1.5, 
                  fontSize: '1rem', 
                  fontWeight: 'bold',
                  boxShadow: 3,
                  bgcolor: 'white',
                  color: 'primary.main',
                  border: '2px solid',
                  borderColor: 'primary.main',
                  '&:hover': {
                    boxShadow: 5,
                    bgcolor: 'primary.main',
                    color: 'white'
                  },
                  '&:disabled': {
                    bgcolor: 'rgba(255, 255, 255, 0.8)',
                    color: 'text.disabled',
                    borderColor: 'divider'
                  }
                }}
              >
                {isLoading ? 'Processing...' : 'Place Order Now'}
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
      
      <Footer />
    </Box>
  )
}