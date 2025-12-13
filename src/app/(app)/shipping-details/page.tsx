'use client'

import React, { useState, useEffect } from 'react'
import {
  Ship,
  Plus,
  Edit,
  Trash2,
  Save,
  Upload,
  Clock,
  AlertTriangle,
  CheckCircle,
  Package,
  Calendar,
  CheckCheck,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/Input-field'
import DatePicker from '@/components/ui/date-picker'
import { Dialog } from '@/components/ui/dialog'
import { Accordion } from '@/components/ui/accordion'
import { Table } from '@/components/ui/table'
import { Chip } from '@/components/ui/chip'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Pagination } from '@/components/ui/pagination'
import { useAppSelector, useAppDispatch } from '@/store/hooks'
import { fetchShippings, createShipping, updateShipping, deleteShipping, confirmShipmentDelivered } from '@/store/slices/shippingsSlice'
import { fetchProducts } from '@/store/slices/productsSlice'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/hooks/useToast'
import { Shipping } from '@/types/auth'

// Setup logger for client-side logging
const logger = console

type ProductItem = {
  name: string
  quantity: number
}

const ShippingDetails: React.FC = () => {
  const dispatch = useAppDispatch()
  const { user } = useAuth()
  const { showToast } = useToast()
  const { shippings, loading, error } = useAppSelector((state) => state.shippings)
  const { products } = useAppSelector((state) => state.products)

  const [shipments, setShipments] = useState<Shipping[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showEditProductModal, setShowEditProductModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [selectedShipment, setSelectedShipment] = useState<Shipping | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null)
  const [selectedShipmentId, setSelectedShipmentId] = useState<number | null>(null)
  const [shipmentToDelete, setShipmentToDelete] = useState<Shipping | null>(null)
  const [currentDate, setCurrentDate] = useState(new Date())

  const [creating, setCreating] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirming, setConfirming] = useState(false)
  
  const [formData, setFormData] = useState({
    shipmentName: '',
    arrivalDate: '',
    trackingNumber: '',
    carrier: '',
    status: 'pending',
    products: [{ name: '', quantity: 0, unit_price: '0.00' }],
  })

  const [productFormData, setProductFormData] = useState({
    name: '',
    quantity: 0,
    unit_price: '0.00'
  })

  // Fetch shippings and products on component mount
  useEffect(() => {
    if (user?.token) {
      dispatch(fetchShippings(user.token))
      dispatch(fetchProducts(user.token))
    }
  }, [dispatch, user?.token])

  // Update current date every minute for real-time countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date())
    }, 60000)
    return () => clearInterval(interval)
  }, [])

  // Sync local shipments with Redux store
  useEffect(() => {
    setShipments(shippings)
  }, [shippings])

  // Reset current page when shipments change
  useEffect(() => {
    setCurrentPage(1)
  }, [shipments])

  // Calculate shipment status and days
  const calculateShipmentStatus = (shipment: Shipping) => {
    const arrivalDate = new Date(shipment.arrival_date)
    const today = currentDate
    const timeDiff = arrivalDate.getTime() - today.getTime()
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24))

    let status = shipment.status || 'pending'
    let daysInfo = ''
    let isOverdue = false
    let overdueDays = 0
    let countdownText = ''

    if (status === 'delivered') {
      // For delivered shipments, calculate how early/late it was delivered
      if (daysDiff > 0) {
        // Delivered before arrival date
        const daysEarly = daysDiff
        daysInfo = `${daysEarly} day${daysEarly > 1 ? 's' : ''} early`
        countdownText = `${daysEarly} days early`
      } else if (daysDiff === 0) {
        // Delivered on arrival date
        daysInfo = 'Delivered on time'
        countdownText = 'Delivered on time'
      } else {
        // Delivered after arrival date
        const daysLate = Math.abs(daysDiff)
        daysInfo = `${daysLate} day${daysLate > 1 ? 's' : ''} late`
        countdownText = `${daysLate} days late`
        isOverdue = true
        overdueDays = daysLate
      }
    } else {
      if (daysDiff < 0 && status !== 'delivered') {
        status = 'overdue'
        isOverdue = true
        overdueDays = Math.abs(daysDiff)
        daysInfo = `${overdueDays} day${overdueDays > 1 ? 's' : ''} overdue`
        countdownText = `${overdueDays} days overdue`
      } else if (daysDiff === 0) {
        daysInfo = 'Due today'
        countdownText = 'Due today'
      } else {
        daysInfo = `${daysDiff} day${daysDiff > 1 ? 's' : ''} remaining`
        countdownText = `${daysDiff} days left`
      }
    }

    return {
      status,
      daysInfo,
      isOverdue,
      overdueDays,
      daysRemaining: daysDiff,
      countdownText
    }
  }


  const handleAddProduct = () => {
    const lastProduct = formData.products[formData.products.length - 1]
    if (!lastProduct || lastProduct.name.trim() === '') {
      showToast('Please enter a product name', 'info')
      return
    }
    setFormData({
      ...formData,
      products: [...formData.products, { name: '', quantity: 0, unit_price: '0.00' }],
    })
  }

  const handleProductChange = (index: number, field: string, value: string | number) => {
    const updatedProducts = [...formData.products]
    updatedProducts[index] = { ...updatedProducts[index], [field]: value }
    setFormData({
      ...formData,
      products: updatedProducts,
    })
  }

  const handleRemoveProduct = (index: number) => {
    const updatedProducts = [...formData.products]
    updatedProducts.splice(index, 1)
    setFormData({
      ...formData,
      products: updatedProducts,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user?.token) return

    setCreating(true)

    logger.info(`Creating shipment: ${formData.shipmentName}, arrival: ${formData.arrivalDate}, carrier: ${formData.carrier}`)

    // Find product IDs based on selected names
    const items = formData.products.map(p => {
      const product = products.find(prod => prod.name === p.name)
      return {
        product: product ? Number(product.id) : 0,
        quantity: p.quantity,
        unit_price: parseFloat(p.unit_price).toFixed(2)
      }
    })

    const shippingData = {
      name: formData.shipmentName,
      arrival_date: formData.arrivalDate,
      tracking_number: formData.trackingNumber,
      carrier: formData.carrier,
      items: items
    }

    try {
      const result = await dispatch(createShipping({ token: user.token, shipping: shippingData })).unwrap()
      showToast(result?.info || 'Shipment added successfully!', 'success')

      dispatch(fetchShippings(user.token))

      setShowAddForm(false)
      setFormData({
        shipmentName: '',
        arrivalDate: '',
        trackingNumber: '',
        carrier: '',
        status: 'pending',
        products: [{ name: '', quantity: 0, unit_price: '0.00' }],
      })
    } catch (error: any) {
      showToast(error.response?.info || 'Failed to add shipment. Please try again.', 'error')
      console.error('Error creating shipping:', error)
    } finally {
      setCreating(false)
    }
  }

  const handleEditShipment = (shipment: any) => {
    setSelectedShipment(shipment)
    setFormData({
      shipmentName: shipment.name,
      arrivalDate: shipment.arrival_date,
      trackingNumber: shipment.tracking_number,
      carrier: shipment.carrier,
      status: shipment.status,
      products: shipment.items.map((i: any) => ({
        name: i.product.name,
        quantity: i.quantity,
        unit_price: i.unit_price
      })),
    })
    setShowEditModal(true)
  }

  const handleDeleteShipment = (shipment: Shipping) => {
    setShipmentToDelete(shipment)
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = async () => {
    if (!shipmentToDelete || !user?.token) return

    setDeleting(true)
    setShowDeleteConfirm(false)

    try {
      await dispatch(deleteShipping({ token: user.token, uid: shipmentToDelete.uid })).unwrap()
      showToast('Shipment deleted successfully!', 'success')
      dispatch(fetchShippings(user.token))
    } catch (error) {
      showToast('Failed to delete shipment. Please try again.', 'error')
      console.error('Error deleting shipping:', error)
    } finally {
      setDeleting(false)
      setShipmentToDelete(null)
    }
  }

  const handleUpdateShipment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedShipment || !user?.token) return

    setUpdating(true)

    // Find product IDs based on selected names
    const items = formData.products.map(p => {
      const product = products.find(prod => prod.name === p.name)
      return {
        product: product ? Number(product.id) : 0,
        quantity: p.quantity,
        unit_price: parseFloat(p.unit_price).toFixed(2)
      }
    })

    const updatedShipping = {
      name: formData.shipmentName,
      arrival_date: formData.arrivalDate,
      tracking_number: formData.trackingNumber,
      carrier: formData.carrier,
      status: formData.status,
      items: items
    }

    try {
      const result = await dispatch(updateShipping({ token: user.token, uid: selectedShipment.uid, shipping: updatedShipping })).unwrap()
      showToast(result?.info || 'Shipment updated successfully', 'success')
      setShowEditModal(false)
      dispatch(fetchShippings(user.token))
    } catch (error: any) {
      showToast(error.response?.info || 'Failed to update shipment. Please try again.', 'error')
      console.error('Error updating shipping:', error)
    } finally {
      setUpdating(false)
    }
  }

  const handleStatusChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      status: value,
    }))
  }

  const handleEditProduct = (product: any, shipmentId: number) => {
    setSelectedProduct(product)
    setSelectedShipmentId(shipmentId)
    setProductFormData({ ...product })
    setShowEditProductModal(true)
  }


  const handleProductFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setProductFormData((prev) => ({
      ...prev,
      [name]: name === 'quantity' ? parseFloat(value) : name === 'unit_price' ? value : value,
    }))
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedShipmentId || !selectedProduct || !user?.token) return

    const shipment = shipments.find(s => s.id === selectedShipmentId)
    if (!shipment) return

    const updatedItems: { product: number; quantity: number; unit_price: string }[] = shipment.items.map((item) =>
      item.product.name === selectedProduct.name ? { product: Number(item.product.id), quantity: productFormData.quantity, unit_price: productFormData.unit_price } : { product: Number(item.product.id), quantity: item.quantity, unit_price: item.unit_price }
    )

    const updatedShipping = {
      name: shipment.name,
      arrival_date: shipment.arrival_date,
      tracking_number: shipment.tracking_number,
      carrier: shipment.carrier,
      status: shipment.status,
      items: updatedItems
    }

    try {
      await dispatch(updateShipping({ token: user.token, uid: shipment.uid, shipping: updatedShipping })).unwrap()
      // Refetch shippings
      dispatch(fetchShippings(user.token))
      showToast('Product quantity updated successfully!', 'success')
      setShowEditProductModal(false)
      dispatch(fetchShippings(user.token))
    } catch (error) {
      showToast('Failed to update product quantity. Please try again.', 'error')
      console.error('Error updating product:', error)
    }
  }

  const handleArrived = async (shipment: Shipping) => {
    if (!user?.token) return

    setConfirming(true)

    try {
      const result = await dispatch(confirmShipmentDelivered({ token: user.token, id: shipment.id })).unwrap()
      showToast(result?.info || 'Shipment confirmed as delivered!', 'success')

      dispatch(fetchShippings(user.token))
    } catch (error: any) {
      showToast(error.response?.info || 'Failed to confirm shipment delivered. Please try again.', 'error')
      console.error('Error confirming shipment delivered:', error)
    } finally {
      setConfirming(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'success'
      case 'processing': return 'info'
      case 'pending': return 'warning'
      case 'overdue': return 'error'
      default: return 'warning'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle className="h-4 w-4" />
      case 'processing': return <Package className="h-4 w-4" />
      case 'pending': return <Clock className="h-4 w-4" />
      case 'overdue': return <AlertTriangle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const getCountdownColor = (status: string, isOverdue: boolean) => {
    if (isOverdue) return 'text-error'
    if (status === 'delivered') return 'text-success'
    if (status === 'processing') return 'text-info'
    return 'text-warning'
  }

  // Calculate paginated shipments
  const totalPages = Math.ceil(shipments.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedShipments = shipments.slice(startIndex, endIndex)

  return (
    <div className="space-y-6">
      <div style={{ animation: `fadeInUp 0.6s ease-out 0s both` }}>
        {loading ? (
          <Skeleton className="h-10 w-48 rounded-lg" />
        ) : (
          <>
            <h1 className="text-2xl font-bold text-foreground">Shipping Details</h1>
            <p className="text-muted-foreground">
              Monitor shipments and track delivery status
            </p>
          </>
        )}
      </div>

      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0" style={{ animation: `fadeInUp 0.6s ease-out 0.1s both` }}>
        {loading ? (
          <Skeleton className="h-10 w-48 rounded-lg" />
        ) : (
          <div className="flex items-center">
            <Ship className="mr-2 h-5 w-5 text-primary" />
            <h2 className="text-lg font-medium text-foreground">
              Shipment Monitoring
            </h2>
          </div>
        )}
        {loading ? (
          <Skeleton className="h-10 w-32 rounded-lg" />
        ) : (
          <div className="flex items-center gap-4">
            {/* <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Import CSV
            </Button> */}
            <Button
              onClick={() => {
                if (!showAddForm) {
                  setFormData({
                    shipmentName: '',
                    arrivalDate: '',
                    trackingNumber: '',
                    carrier: '',
                    status: 'pending',
                    products: [{ name: '', quantity: 0, unit_price: '0.00' }],
                  })
                }
                setShowAddForm(!showAddForm)
              }}
              variant="primary"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Shipment
            </Button>
          </div>
        )}
      </div>

      {showAddForm && (
        <div className="rounded-lg border border-border bg-card p-6 shadow" style={{ animation: `fadeInUp 0.6s ease-out 0.2s both` }}>
          <h3 className="mb-4 text-lg font-medium text-foreground">
            New Shipment
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Input
                label="Shipment Name"
                type="text"
                id="shipmentName"
                value={formData.shipmentName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    shipmentName: e.target.value,
                  })
                }
                placeholder="e.g., June 2023 Electronics"
                required
                variant='filled'
              />
              <DatePicker
                label="Arrival Date"
                id="arrivalDate"
                mode="single"
                placeholder="Select arrival date"
                variant="filled"
                defaultDate={formData.arrivalDate ? new Date(formData.arrivalDate) : undefined}
                onChange={([selectedDate]) => {
                  setFormData({
                    ...formData,
                    arrivalDate: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
                  })
                }}
              />
              <Input
                label="Tracking Number"
                type="text"
                id="trackingNumber"
                value={formData.trackingNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    trackingNumber: e.target.value,
                  })
                }
                placeholder="Enter tracking number"
                required
                variant='filled'
              />
              <Input
                label="Carrier"
                type="text"
                id="carrier"
                value={formData.carrier}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    carrier: e.target.value,
                  })
                }
                placeholder="e.g., DHL, FedEx, UPS"
                required
                variant='filled'
              />
              <Select
                label="Status"
                clearable
                placeholder="Select status"
                value={formData.status}
                onChange={(value) => handleStatusChange(value as string)}
                required
                variant='filled'
                options={[
                  { value: 'pending', label: 'Pending' },
                  { value: 'processing', label: 'Processing' },
                  { value: 'delivered', label: 'Delivered' },
                ]}
              />
            </div>
            <div className="mt-6">
              <label className="block text-sm font-medium text-foreground">
                Products in Shipment
              </label>
              <div className="mt-2 space-y-3">
                {formData.products.map((product, index) => (
                  <div key={index} className="flex items-center gap-4" style={{ animation: `fadeInUp 0.6s ease-out ${(index + 3) * 0.1}s both` }}>
                    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3 mt-6">
                      <Select
                        label="Product"
                        clearable
                        placeholder="Select product"
                        searchable
                        value={product.name}
                        onChange={(value) => handleProductChange(index, 'name', value as string)}
                        required
                        variant='filled'
                        options={products.map(p => ({ value: p.name, label: p.name }))}
                      />
                      <Input
                        label="Quantity"
                        type="number"
                        value={product.quantity}
                        onChange={(e) =>
                          handleProductChange(index, 'quantity', parseFloat(e.target.value) || 0)
                        }
                        placeholder="0"
                        min="0"
                        required
                        variant='filled'
                      />
                      <Input
                        label="Unit Price"
                        type="number"
                        value={product.unit_price}
                        onChange={(e) =>
                          handleProductChange(index, 'unit_price', e.target.value)
                        }
                        placeholder="0"
                        min="0"
                        required
                        variant='filled'
                      />
                    </div>
                    <div className="flex items-center space-x-2 mt-6">
                      <Button
                        type="button"
                        onClick={() => handleRemoveProduct(index)}
                        variant="tonal"
                        color={'error'}
                        disabled={formData.products.length === 1}
                        className="mt-6"
                      >
                        <Trash2 className="h-4 w-4 text-error" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={handleAddProduct}
                  variant="tonal"
                  color={'info'}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Button
                type="button"
                onClick={() => setShowAddForm(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button loading={creating} type="submit" variant="primary">
                Save Shipment
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Shipment Monitoring Summary */}
      <div className="rounded-lg bg-card p-6 shadow" style={{ animation: `fadeInUp 0.6s ease-out 0.7s both` }}>
        {loading ? (
          <>
            <Skeleton className="mb-4 h-6 w-64" />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
              <Skeleton className="h-20 rounded-lg" />
            </div>
          </>
        ) : (
          <>
            <h3 className="mb-4 text-lg font-medium text-foreground">
              Shipment Monitoring Summary
            </h3>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
              <div className="rounded-lg bg-primary/10 p-4" style={{ animation: `fadeInUp 0.6s ease-out 0.8s both` }}>
                <h4 className="mb-2 text-sm font-medium text-primary">
                  Total Shipments
                </h4>
                <p className="text-2xl font-semibold text-primary">{shipments.length}</p>
              </div>
              <div className="rounded-lg bg-success/10 p-4" style={{ animation: `fadeInUp 0.6s ease-out 0.9s both` }}>
                <h4 className="mb-2 text-sm font-medium text-success">
                  Delivered
                </h4>
                <p className="text-2xl font-semibold text-success">
                  {shipments.filter(s => s.status === 'delivered').length}
                </p>
              </div>
              <div className="rounded-lg bg-warning/10 p-4" style={{ animation: `fadeInUp 0.6s ease-out 0.9s both` }}>
                <h4 className="mb-2 text-sm font-medium text-warning">
                  Pending
                </h4>
                <p className="text-2xl font-semibold text-warning">
                  {shipments.filter(s => s.status === 'pending').length}
                </p>
              </div>
              <div className="rounded-lg bg-info/10 p-4" style={{ animation: `fadeInUp 0.6s ease-out 1.0s both` }}>
                <h4 className="mb-2 text-sm font-medium text-info">
                  Processing
                </h4>
                <p className="text-2xl font-semibold text-info">
                  {shipments.filter(s => s.status === 'processing').length}
                </p>
              </div>
              <div className="rounded-lg bg-error/10 p-4" style={{ animation: `fadeInUp 0.6s ease-out 1.1s both` }}>
                <h4 className="mb-2 text-sm font-medium text-error">
                  Overdue
                </h4>
                <p className="text-2xl font-semibold text-error">
                  {shipments.filter(s => s.status === 'overdue').length}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
      
      <div style={{ animation: `fadeInUp 0.6s ease-out 0.3s both` }}>
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-5 w-5 rounded" />
                    <div>
                      <Skeleton className="h-6 w-48 mb-2" />
                      <Skeleton className="h-4 w-64" />
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <Skeleton className="h-6 w-20 mb-1" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-8 w-24 rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <Accordion type="single" defaultValue="1">
            {paginatedShipments.map((shipment, index) => {
              const { status, daysInfo, isOverdue, countdownText } = calculateShipmentStatus(shipment)
              const products = (shipment.items || []).map(item => ({ name: item.product.name, quantity: item.quantity, unit_price: item.unit_price }))
              const productColumns = [
                { key: 'name' as keyof typeof products[0], label: 'Product' },
                { key: 'quantity' as keyof typeof products[0], label: 'Quantity' },
                { key: 'unit_price' as keyof typeof products[0], label: 'Unit Price'}
              ]

              return (
                <Accordion.Item key={index} value={shipment.id?.toString() || index.toString()}>
                  <Accordion.Trigger>
                    <div className="flex items-center justify-between w-full" style={{ animation: `fadeInUp 0.6s ease-out ${(index + 4) * 0.1}s both` }}>
                      <div className="flex items-center">
                        <Ship className="mr-3 h-5 w-5 text-primary" />
                        <div>
                          <h3 className="text-lg font-medium text-foreground">
                            {shipment.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Arrival: {shipment.arrival_date} • {shipment.carrier} • {shipment.tracking_number}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mr-6">
                        <div className="text-right">
                          <div className={`flex items-center gap-1 text-lg font-semibold ${getCountdownColor(status, isOverdue)}`}>
                            <Calendar className="h-4 w-4" />
                            {countdownText}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {daysInfo}
                          </p>
                        </div>
                        <Chip
                          variant='tonal'
                          color={getStatusColor(status)}
                          className="flex items-center gap-1"
                        >
                          {getStatusIcon(status)}
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Chip>
                      </div>
                    </div>
                  </Accordion.Trigger>
                  <Accordion.Content>
                    <div className="p-6 overflow-y-auto" style={{ maxHeight: '400px' }}>
                      <div className="my-4 flex justify-end space-x-3">
                        <Button
                          startIcon={<CheckCheck className='w-4 h-4'/>}
                          loading={confirming}
                          onClick={() => handleArrived(shipment)}
                          disabled={shipment.status === 'delivered'}
                        >
                          Arrived
                        </Button>
                        <Button
                          onClick={() => handleEditShipment(shipment)}
                          variant="outline"
                          disabled={shipment.status === 'delivered'}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDeleteShipment(shipment)}
                          variant="destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                      <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                        <div className="rounded-lg bg-muted p-4" style={{ animation: `fadeInUp 0.6s ease-out 0.5s both` }}>
                          <h4 className="mb-2 text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            Delivery Timeline
                          </h4>
                          <p className={`text-2xl font-semibold ${getCountdownColor(status, isOverdue)}`}>
                            {countdownText}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {daysInfo}
                          </p>
                        </div>
                        <div className="rounded-lg bg-muted p-4" style={{ animation: `fadeInUp 0.6s ease-out 0.6s both` }}>
                          <h4 className="mb-2 text-sm font-medium text-muted-foreground">
                            Tracking Info
                          </h4>
                          <p className="text-lg font-semibold text-foreground">
                            {shipment.tracking_number}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {shipment.carrier}
                          </p>
                        </div>
                        <div className="rounded-lg bg-muted p-4" style={{ animation: `fadeInUp 0.6s ease-out 0.7s both` }}>
                          <h4 className="mb-2 text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Total Products
                          </h4>
                          <p className="text-2xl font-semibold text-foreground">
                            {(shipment.items || []).length}
                          </p>
                        </div>
                      </div>
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="text-lg font-medium text-foreground">
                          Products in Shipment
                        </h4>
                      </div>
                      <Table
                        data={products}
                        columns={productColumns}
                        className='mb-4'
                        actions={(product) => (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditProduct(product, shipment.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                        rowStyle={(item, index) => ({ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` })}
                      />
                    </div>
                  </Accordion.Content>
                </Accordion.Item>
              )
            })}
          </Accordion>
        )}
        {!loading && totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>
        )}
      </div>

      {/* Edit Shipment Modal */}
      <Dialog
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Shipment"
        size="4xl"
        color="info"
      >
        <form onSubmit={handleUpdateShipment}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Input
              label="Shipment Name"
              type="text"
              id="shipmentName"
              value={formData.shipmentName}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  shipmentName: e.target.value,
                })
              }
              placeholder="e.g., June 2023 Electronics"
              required
              variant='filled'
            />
            <DatePicker
              label="Arrival Date"
              id="arrivalDate"
              mode="single"
              placeholder="Select arrival date"
              variant="filled"
              defaultDate={formData.arrivalDate ? new Date(formData.arrivalDate) : undefined}
              onChange={([selectedDate]) => {
                setFormData({
                  ...formData,
                  arrivalDate: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
                })
              }}
            />
            <Input
              label="Tracking Number"
              type="text"
              id="trackingNumber"
              value={formData.trackingNumber}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  trackingNumber: e.target.value,
                })
              }
              placeholder="Enter tracking number"
              required
              variant='filled'
            />
            <Input
              label="Carrier"
              type="text"
              id="carrier"
              value={formData.carrier}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  carrier: e.target.value,
                })
              }
              placeholder="e.g., DHL, FedEx, UPS"
              required
              variant='filled'
            />
            <Select
              label="Status"
              clearable
              placeholder="Select status"
              value={formData.status}
              onChange={(value) => handleStatusChange(value as string)}
              required
              variant='filled'
              options={[
                { value: 'pending', label: 'Pending' },
                { value: 'processing', label: 'Processing' },
                { value: 'delivered', label: 'Delivered' },
              ]}
            />
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-foreground">
              Products in Shipment
            </label>
            <div className="mt-6 space-y-3">
              {formData.products.map((product, index) => (
                <div key={index} className="flex items-center gap-4" style={{ animation: `fadeInUp 0.6s ease-out ${(index + 3) * 0.1}s both` }}>
                  <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-3">
                    <Select
                      label="Product"
                      clearable
                      placeholder="Select product"
                      searchable
                      value={product.name}
                      onChange={(value) => handleProductChange(index, 'name', value as string)}
                      required
                      variant='filled'
                      options={products.map(p => ({ value: p.name, label: p.name }))}
                    />
                    <Input
                      label="Quantity"
                      type="number"
                      value={product.quantity}
                      onChange={(e) =>
                        handleProductChange(index, 'quantity', parseFloat(e.target.value) || 0)
                      }
                      placeholder="0"
                      min="0"
                      required
                      variant='filled'
                    />
                    <Input
                      label="Unit Price"
                      type="number"
                      value={product.unit_price}
                      onChange={(e) =>
                        handleProductChange(index, 'unit_price', e.target.value)
                      }
                      placeholder="0"
                      min="0"
                      required
                      variant='filled'
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      type="button"
                      onClick={() => handleRemoveProduct(index)}
                      variant="tonal"
                      color={'error'}
                      disabled={formData.products.length === 1}
                      className="mt-6"
                    >
                      <Trash2 className="h-4 w-4 text-error" />
                    </Button>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                onClick={handleAddProduct}
                variant="tonal"
                color={'info'}
                className="mt-6"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
            <Button
              type="button"
              onClick={() => setShowEditModal(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button loading={updating} type="submit" variant="primary">
              Save Changes
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Edit Product Modal */}
      <Dialog
        isOpen={showEditProductModal}
        onClose={() => setShowEditProductModal(false)}
        title="Edit Product"
        size="lg"
        color="info"
        actions={[
          <div key="edit-product-actions" className="flex justify-end space-x-3">
            <Button
              type="button"
              onClick={() => setShowEditProductModal(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button startIcon={<Save className="h-4 w-4" />} type="submit" form="edit-product-form" variant="primary">
              Save Changes
            </Button>
          </div>
        ]}
      >
        <form id="edit-product-form" onSubmit={handleUpdateProduct}>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <Input
                label="Product Name"
                type="text"
                name="name"
                id="name"
                value={productFormData.name}
                onChange={handleProductFormChange}
                required
              />
            </div>
            <div className="sm:col-span-3">
              <Input
                label="Quantity"
                type="number"
                name="quantity"
                id="quantity"
                value={productFormData.quantity}
                onChange={handleProductFormChange}
                required
                min="0"
              />
            </div>
            <div className="sm:col-span-3">
              <Input
                label="Unit Price"
                type="number"
                name="unit_price"
                id="unit_price"
                value={productFormData.unit_price}
                onChange={handleProductFormChange}
                required
                min="0"
              />
            </div>
          </div>
        </form>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Confirm Delete"
        size="md"
        color="error"
        actions={[
          <div key="delete-confirm-actions" className="flex justify-end space-x-3">
            <Button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              loading={deleting}
              onClick={handleConfirmDelete}
              variant="destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        ]}
      >
        <div className="text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-error mb-4" />
          <p className="text-lg font-medium text-foreground mb-2">
            Are you sure you want to delete this shipment?
          </p>
          <p className="text-sm text-muted-foreground">
            This action cannot be undone. The shipment "{shipmentToDelete?.name}" and all its associated data will be permanently removed.
          </p>
        </div>
      </Dialog>
    </div>
  )
}

export default ShippingDetails