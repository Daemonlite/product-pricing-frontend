'use client'
import React, { useEffect, useState } from 'react'
import {
  Calculator,
  Save,
  RefreshCcw,
  DollarSign,
  Percent,
  AlertTriangle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/Input-field'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { calculatePricing } from '@/store/slices/pricingSlice'
import { fetchShippings } from '@/store/slices/shippingsSlice'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'

const PricingCalculatorPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const { user } = useAuth()
   const { showToast } = useToast()
  const { result: pricingResult, loading: pricingLoading, error: pricingError } = useAppSelector(state => state.pricing)
  const { shippings, loading: shippingsLoading, error: shippingsError } = useAppSelector(state => state.shippings)

  const [selectedShipment, setSelectedShipment] = useState('')
  const [products, setProducts] = useState<{
    name: string;
    quantity: number;
    unit_price: number;
    selling_price: number;
  }[]>([])
  const [shippingCost, setShippingCost] = useState('')
  const [importTax, setImportTax] = useState('')
  const [othersType, setOthersType] = useState<'percentage' | 'fixed'>('percentage')
  const [others, setOthers] = useState('')

  // Fetch shippings on component mount
  useEffect(() => {
    if (user?.token) {
      dispatch(fetchShippings(user.token))
    }
  }, [dispatch, user?.token])

  // Set products when shipment selected
  useEffect(() => {
    if (selectedShipment && shippings) {
      const shipment = shippings.find((s: any) => s.id === selectedShipment)
      if (shipment) {
        setProducts(shipment.items.map((item: any) => ({
          name: item.product.name,
          quantity: item.quantity,
          unit_price: parseFloat(item.unit_price) || 0,
          selling_price: parseFloat(item.product.selling_price) || 0
        })))
        setShippingCost('')
        setImportTax('')
        setOthers('')
      }
    } else {
      setProducts([])
      setShippingCost('')
      setImportTax('')
      setOthers('')
    }
  }, [selectedShipment, shippings])

  const handleReset = () => {
    setSelectedShipment('')
    setProducts([])
    setShippingCost('')
    setImportTax('')
    setOthers('')
  }

  const handleCalculatePricing = async () => {
    if (!user?.token) {
      return
    }

    const payload = {
      shipping: parseInt(selectedShipment) || 0,
      shipping_cost: parseFloat(shippingCost) || 0,
      import_tax: parseFloat(importTax) || 0,
      other_costs: parseFloat(others) || 0,
      other_cost_type: othersType
    }

    try {
      const result = await dispatch(calculatePricing({ token: user.token as string, payload })).unwrap()
      showToast(result?.info || 'Pricing calculated successfully!', 'success')
    } catch (error: any) {
      showToast(error || 'Failed to calculate pricing', 'error')
    } finally {
        handleReset()
      }
  }

  return (
    <div className="space-y-6">
      {shippingsLoading ? (
        <div className='space-y-4'>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-6 w-2xl" />
        </div>
      ) : (
        <div style={{ animation: `fadeInUp 0.6s ease-out 0s both` }}>
            <h1 className="text-2xl font-bold text-foreground">Pricing Calculator</h1>
            <p className="text-muted-foreground">
              Calculate optimal selling prices based on cost and target margins
            </p>
          </div>
      )}


      {shippingsLoading ? (
        <div className="overflow-hidden rounded-lg bg-card shadow" style={{ animation: `fadeInUp 0.6s ease-out 0.1s both` }}>
          <div className="border-b border-border bg-muted px-6 py-4">
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="col-span-2 space-y-4">
                <Skeleton className="h-6 w-40 mb-4" />
                <div className="space-y-4">
                  {Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className="grid grid-cols-1 gap-4 md:grid-cols-3 items-end border rounded-lg p-4 bg-muted/20">
                      <div>
                        <Skeleton className="h-4 w-16 mb-2" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div>
                        <Skeleton className="h-4 w-16 mb-2" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                      <div>
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-10 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-2 space-y-4">
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <Skeleton className="h-4 w-24 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-28 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className="mt-8 flex">
                    <Skeleton className="h-10 w-24 rounded-r-none" />
                    <Skeleton className="h-10 w-28 rounded-l-none" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-lg bg-card shadow" style={{ animation: `fadeInUp 0.6s ease-out 0.1s both` }}>
          <div className="border-b border-border bg-muted px-6 py-4">
            <h2 className="text-lg font-medium text-foreground">
              <Calculator className="mr-2 inline h-5 w-5 text-primary" />
              Price Calculator
            </h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Select
                label="Shipment"
                clearable
                searchable
                value={selectedShipment}
                onChange={(value) => setSelectedShipment(value as string)}
                options={shippings?.map((s: any) => ({ value: s.id, label: s.name })) || []}
                variant='filled'
                required
              />

              {products.length > 0 && (
                <div className="col-span-2">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-foreground">Products in Shipment</h3>
                  </div>
                  <div className="space-y-4">
                    {products.map((product, index) => (
                      <div key={index} className="grid grid-cols-1 gap-4 md:grid-cols-3 items-end border rounded-lg p-4 bg-muted/20">
                        <Input
                          label="Product"
                          type="text"
                          value={product.name}
                          variant='filled'
                          disabled
                        />
                        <Input
                          label="Quantity"
                          type="number"
                          value={product.quantity}
                          placeholder="0"
                          min="0"
                          variant='filled'
                          disabled
                        />
                        <Input
                          label="Unit Price (₵)"
                          type="number"
                          value={product.unit_price || 0}
                          placeholder="0.00"
                          variant='filled'
                          disabled
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="col-span-2 space-y-4">
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <Input
                    label="Shipping Cost (₵)"
                    type="number"
                    value={parseFloat(shippingCost) || 0}
                    onChange={(e) => setShippingCost(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step={1}
                    variant='filled'
                  />
                  <Input
                    label="Import Tax/Fees (₵)"
                    type="number"
                    value={parseFloat(importTax) || 0}
                    onChange={(e) => setImportTax(e.target.value)}
                    placeholder="0.00"
                    min="0"
                    step={1}
                    variant='filled'
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div className="mt-8 flex">
                    <Button
                      type="button"
                      startIcon={<Percent className="h-4 w-4" />}
                      onClick={() => setOthersType('percentage')}
                      variant={othersType === 'percentage' ? 'primary' : 'outline'}
                      className="rounded-r-none"
                    >
                      Percentage
                    </Button>
                    <Button
                      type="button"
                      startIcon={<DollarSign className="h-4 w-4" />}
                      onClick={() => setOthersType('fixed')}
                      variant={othersType === 'fixed' ? 'primary' : 'outline'}
                      className="rounded-l-none"
                    >
                      Fixed Amount
                    </Button>
                  </div>
                  <Input
                    label={
                      othersType === 'percentage'
                        ? 'Other Costs (%)'
                        : 'Other Costs (₵)'
                    }
                    type="number"
                    value={parseFloat(others) || 0}
                    onChange={(e) => setOthers(e.target.value)}
                    placeholder={othersType === 'percentage' ? '0' : '0.00'}
                    min="0"
                    step={othersType === 'percentage' ? 1 : 1}
                    variant='filled'
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <Button onClick={handleReset} variant="outline">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button startIcon={<Calculator className="h-4 w-4" />} loading={pricingLoading} onClick={handleCalculatePricing} disabled={pricingLoading}>
                Calculate Pricing
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default PricingCalculatorPage