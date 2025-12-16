'use client'

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Search,
  Filter,
  Plus,
  Download,
  Upload,
  Edit,
  Trash2,
  Save,
  X,
  Grid3X3,
  Zap,
  Headphones,
  Monitor,
  Tablet,
  Package,
  SaveIcon,
  Key,
} from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Table } from '../../../components/ui/table'
import { Dialog } from '../../../components/ui/dialog'
import Input from '../../../components/ui/Input-field'
import { Select } from '../../../components/ui/select'
import { Skeleton } from '../../../components/ui/skeleton'
import SummaryCards from '../../../components/SummaryCards'
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../../../store/slices/productsSlice'
import { fetchCategories } from '../../../store/slices/categoriesSlice'
import { RootState, AppDispatch } from '../../../store/store'
import { useAuth } from '../../../hooks/useAuth'
import { useToast } from '../../../hooks/useToast'
import { Product } from '../../../types/auth'

// Define interface for new product form
interface NewProductForm {
  name: string
  sku: string
  category: string
  cost_price: number
  stock: number
}

const ProductsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useAuth()
  const { products, loading, error } = useSelector((state: RootState) => state.products)
  const { categories } = useSelector((state: RootState) => state.categories)
  const { showToast } = useToast()

  const [currentPage, setCurrentPage] = useState(1)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [showModal, setShowModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletingProduct, setDeletingProduct] = useState<{ id: string; name: string } | null>(null)
  const [newProduct, setNewProduct] = useState<{
    id: string
    name: string
    sku: string
    category: string
    cost_price: number
    stock: number
  }>({
    id: '',
    name: '',
    sku: '',
    category: '',
    cost_price: 0,
    stock: 0,
  })
  const [newProducts, setNewProducts] = useState<NewProductForm[]>([
    { name: '', sku: '', category: '', cost_price: 0, stock: 0 }
  ])
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (user?.token) {
      dispatch(fetchProducts(user.token))
      dispatch(fetchCategories(user.token))
    }
  }, [dispatch, user?.token])

  const categoryOptions = categories.map(cat => ({ value: cat.id.toString(), label: cat.name }))

  // Category name mapping
  const productsWithCategoryName = products.map(product => {
    try {
      let categoryId: string | number | undefined;
      
      if (product.category && typeof product.category === 'object') {
        categoryId = (product.category as any).id;
      } else if (product.category) {
        categoryId = product.category;
      } else {
        categoryId = undefined;
      }

      const category = categories.find(cat => {
        if (!categoryId) return false;
        return cat.id.toString() === categoryId.toString();
      });

      // Format cost_price
      const costPrice = product.cost_price
        ? typeof product.cost_price === 'string'
          ? parseFloat(product.cost_price)
          : Number(product.cost_price)
        : 0;

      // Format selling_price
      const sellingPrice = product.selling_price
        ? typeof product.selling_price === 'string'
          ? parseFloat(product.selling_price)
          : Number(product.selling_price)
        : 0;

      return {
        ...product,
        categoryId: categoryId?.toString() || '',
        categoryName: category ? category.name : 'Unknown',
        cost_price: costPrice,
        selling_price: sellingPrice,
        stock: Number(product.stock) || 0
      }
    } catch (error) {
      console.error('Error mapping product:', product, error);
      return {
        ...product,
        categoryId: '',
        categoryName: 'Unknown',
        cost_price: 0,
        selling_price: 0,
        stock: 0
      };
    }
  })

  const filteredProducts = selectedCategory === 'All' 
    ? productsWithCategoryName 
    : productsWithCategoryName.filter(product => product.categoryId === selectedCategory);

  const columns: any[] = [
    { key: 'name', label: 'Product', sortable: true },
    { key: 'sku', label: 'SKU' },
    { key: 'categoryName', label: 'Category', sortable: true },
    {
      key: 'cost_price',
      label: 'Cost Price',
      format: (val: number) => `₵${val ? val.toFixed(2) : '0.00'}`
    },
    { 
      key: 'selling_price', 
      label: 'Selling Price', 
      format: (val: number) => `₵${val ? val.toFixed(2) : '0.00'}`
    },
    { key: 'stock', label: 'Stock', sortable: true },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewProduct(prev => ({
      ...prev,
      [name]: name === 'cost_price' || name === 'stock' ? parseFloat(value) || 0 : value,
    }))
  }

  const handleExportProducts = () => {
    window.print()
  }

  const handleProductsInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewProducts(prev => prev.map((prod, i) => i === index ? {
      ...prod,
      [name]: name === 'cost_price' || name === 'stock' ? parseFloat(value) || 0 : value,
    } : prod))
  }

  const addProductForm = () => {
    setNewProducts(prev => [...prev, { name: '', sku: '', category: '', cost_price: 0, stock: 0 }])
  }

  const removeProductForm = (index: number) => {
    if (newProducts.length > 1) {
      setNewProducts(prev => prev.filter((_, i) => i !== index))
    }
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (user?.token) {
      setIsSubmitting(true)
      try {
        const productsToCreate = newProducts.map(prod => ({
          name: prod.name,
          sku: prod.sku,
          category: parseInt(prod.category),
          cost_price: prod.cost_price,
          stock: prod.stock,
        }))
        const result = await dispatch(createProduct({
          token: user.token,
          products: productsToCreate
        })).unwrap()

        showToast(result?.info || 'Products created successfully!', 'success')

        // Refresh the products
        dispatch(fetchProducts(user.token))

        setShowModal(false)
        setNewProducts([{ name: '', sku: '', category: '', cost_price: 0, stock: 0 }])
      } catch (error: any) {
        console.error('Failed to create products:', error)
        showToast(error?.message || error || 'Failed to create products', 'error')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleEditProduct = (product: any) => {
    let categoryId = '';
    
    // Extract category id
    if (product.categoryId) {
      categoryId = product.categoryId;
    } else if (product.category && typeof product.category === 'object') {
      categoryId = (product.category as any).id?.toString() || '';
    } else {
      categoryId = product.category?.toString() || '';
    }

    setNewProduct({
      id: product.uid || product.id,
      name: product.name || '',
      sku: product.sku || '',
      category: categoryId,
      cost_price: product.cost_price || 0,
      stock: product.stock || 0,
    })
    setIsEditing(true)
    setShowModal(true)
  }

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (user?.token && newProduct.id) {
      setIsSubmitting(true)
      try {
        const result = await dispatch(updateProduct({
          token: user.token,
          uid: newProduct.id,
          product: {
            name: newProduct.name,
            sku: newProduct.sku,
            category: parseInt(newProduct.category),
            cost_price: newProduct.cost_price,
            stock: newProduct.stock,
          }
        })).unwrap()
        
        showToast(result?.info || 'Product updated successfully!', 'success')
        
        // Refresh the products list
        dispatch(fetchProducts(user.token))
        
        setShowModal(false)
        setNewProduct({
          id: '',
          name: '',
          sku: '',
          category: '',
          cost_price: 0,
          stock: 0,
        })
        setIsEditing(false)
      } catch (error: any) {
        console.error('Failed to update product:', error)
        showToast(error?.message || error?.response?.data?.detail || 'Failed to update product', 'error')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleDeleteProduct = (product: any) => {
    setDeletingProduct({ 
      id: product.uid || product.id, 
      name: product.name 
    })
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    if (user?.token && deletingProduct) {
      setIsDeleting(true)
      try {
        await dispatch(deleteProduct({ 
          token: user.token, 
          uid: deletingProduct.id 
        })).unwrap()
        
        showToast('Product deleted successfully!', 'success')
        
        // Refresh the products list
        dispatch(fetchProducts(user.token))
        
        setShowDeleteConfirm(false)
        setDeletingProduct(null)
      } catch (error: any) {
        console.error('Failed to delete product:', error)
        showToast(error?.message || 'Failed to delete product', 'error')
      } finally {
        setIsDeleting(false)
      }
    }
  }

  // Fixed: Removed extra closing div tag
  const categoryFilters = (
    <div className="flex items-center gap-1 text-nowrap overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <button
        key="All"
        style={{
          animation: `fadeInUp 0.6s ease-out 0s both`
        }}
        onClick={() => setSelectedCategory('All')}
        className={`flex items-center text-base font-medium cursor-pointer rounded px-6 py-1 transition duration-300 whitespace-nowrap flex-shrink-0 ${selectedCategory === 'All' ? 'text-white bg-primary' : 'text-foreground hover:text-primary'}`}
      >
        <Grid3X3 className="mr-1 h-4 w-4 flex-shrink-0" />
        All
      </button>
      {categories.map((category, index) => (
        <button
          key={category.id}
          style={{
            animation: `fadeInUp 0.6s ease-out ${(index + 1) * 0.1}s both`
          }}
          onClick={() => setSelectedCategory(category.id.toString())}
          className={`flex items-center text-base font-medium cursor-pointer rounded px-6 py-1 transition duration-300 whitespace-nowrap flex-shrink-0 ${selectedCategory === category.id.toString() ? 'text-white bg-primary' : 'text-foreground hover:text-primary'}`}
        >
          <Package className="mr-1 h-4 w-4 flex-shrink-0" />
          {category.name}
        </button>
      ))}
    </div>
  )

  const headerActions = (
    <div className="flex gap-4">
      <Button onClick={() => {
        console.log('newProduct', newProduct)
        setIsEditing(false)
        setNewProduct({
          id: '',
          name: '',
          sku: '',
          category: '',
          cost_price: 0,
          stock: 0,
        })
        setNewProducts([{ name: '', sku: '', category: '', cost_price: 0, stock: 0 }])
        setShowModal(true)
      }}>
        <Plus className="mr-2 h-4 w-4" />
        Add Product
      </Button>
    </div>
  )

  const actions = (item: any) => (
    <div className="flex space-x-2">
      <Button variant="ghost" color="info" size="icon" onClick={() => handleEditProduct(item)} startIcon={<Edit className="h-4 w-4" />} />
      <Button variant="ghost" color="error" size="icon" onClick={() => handleDeleteProduct(item)} startIcon={<Trash2 className="h-4 w-4" />} />
    </div>
  )

  return (
    <div className="space-y-6">
      <div style={{ animation: `fadeInUp 0.6s ease-out 0s both` }}>
        {loading ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <SummaryCards products={products} />
        )}
      </div>

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center" style={{ animation: `fadeInUp 0.6s ease-out 0.1s both` }}>
        {loading ? (
          <Skeleton className="h-10 w-32 rounded-lg" />
        ) : (
          <div>
            <h1 className="text-2xl font-bold">Products</h1>
            <p className="text-sm text-muted-foreground">Manage your product inventory and pricing</p>
          </div>
        )}

        {loading ? (
          <Skeleton className="h-10 w-32 rounded-lg" />
        ) : (
          <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
            {headerActions}
          </div>
        )}
      </div>

      <div className="overflow-hidden rounded-lg bg-card" style={{ animation: `fadeInUp 0.6s ease-out 0.2s both` }}>
        
        <div className="flex items-center gap-1 scroll-auto overflow-x-auto max-w-6xl mx-auto px-6 py-6">
          {loading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            categoryFilters
          )}
        </div>

        {loading ? (
          <div className="space-y-4 p-4">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ) : filteredProducts.length > 0 ? (
          <Table
            data={filteredProducts}
            columns={columns}
            searchable
            pagination
            hoverable
            actions={actions}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            itemsPerPage={8}
            rowStyle={(item, index) => ({ animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both` })}
          />
        ) : (
          <div className="p-8 text-center">
            <div className="flex justify-center mb-8">
              <Package className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No products found. Add your first product to get started.</p>
          </div>
        )}
      </div>

      <Dialog
        isOpen={showModal}
        onClose={() => {
          setShowModal(false)
          setIsEditing(false)
          setNewProduct({
            id: '',
            name: '',
            sku: '',
            category: '',
            cost_price: 0,
            stock: 0,
          })
          setNewProducts([{ name: '', sku: '', category: '', cost_price: 0, stock: 0 }])
        }}
        title={isEditing ? "Edit Product" : "Add New Product"}
        size="3xl"
        color="primary"
        actions={
          <>
            <Button variant="outline" onClick={() => {
              setShowModal(false)
              setIsEditing(false)
              setNewProduct({
                id: '',
                name: '',
                sku: '',
                category: '',
                cost_price: 0,
                stock: 0,
              })
            }}>
              Cancel
            </Button>
            <Button 
              type={isEditing ? "button" : "submit"}
              startIcon={isEditing ? <Edit className="h-4 w-4" /> : <SaveIcon className="h-4 w-4" />} 
              loading={isSubmitting} 
              onClick={isEditing ? handleUpdateProduct : handleAddProduct}
              disabled={isSubmitting}
            >
              {isEditing ? "Update Product" : "Add Product"}
            </Button>
          </>
        }
      >
        {isEditing ? (
          <form onSubmit={handleUpdateProduct} id="edit-product-form">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <Input
                  label="Product Name"
                  type="text"
                  name="name"
                  placeholder='e.g. "iPhone 13 Pro"'
                  value={newProduct.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="sm:col-span-3">
                <Input
                  label="SKU"
                  type="text"
                  name="sku"
                  placeholder='e.g. "IP13-PRO-256"'
                  value={newProduct.sku}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="sm:col-span-3">
                <Select
                  label="Category"
                  clearable
                  placeholder="Select category"
                  options={categoryOptions}
                  value={newProduct.category}
                  onChange={(val) => setNewProduct(prev => ({ ...prev, category: val as string }))}
                  required
                />
              </div>
              <div className="sm:col-span-3">
                <Input
                  label="Stock"
                  type="number"
                  name="stock"
                  placeholder='e.g. "10"'
                  value={newProduct.stock.toString()}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step={1}
                />
              </div>
              <div className="sm:col-span-3">
                <Input
                  label="Cost Price (₵)"
                  type="number"
                  name="cost_price"
                  placeholder='e.g. "1000"'
                  value={newProduct.cost_price.toString()}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step={0.01}
                />
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleAddProduct} id="add-product-form">
            <div className="space-y-6">
              {newProducts.map((product, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Product {index + 1}</h3>
                    {newProducts.length > 1 && (
                      <Button
                        variant="ghost"
                        color="error"
                        size="icon"
                        onClick={() => removeProductForm(index)}
                        type="button"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <Input
                        label="Product Name"
                        type="text"
                        name="name"
                        placeholder='e.g. "iPhone 13 Pro"'
                        value={product.name}
                        onChange={(e) => handleProductsInputChange(index, e)}
                        required
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <Input
                        label="SKU"
                        type="text"
                        name="sku"
                        placeholder='e.g. "IP13-PRO-256"'
                        value={product.sku}
                        onChange={(e) => handleProductsInputChange(index, e)}
                        required
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <Select
                        label="Category"
                        clearable
                        placeholder="Select category"
                        options={categoryOptions}
                        value={product.category}
                        onChange={(val) => setNewProducts(prev => prev.map((prod, i) => i === index ? { ...prod, category: val as string } : prod))}
                        required
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <Input
                        label="Stock"
                        type="number"
                        name="stock"
                        placeholder='e.g. "10"'
                        value={product.stock.toString()}
                        onChange={(e) => handleProductsInputChange(index, e)}
                        required
                        min="0"
                        step={1}
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <Input
                        label="Cost Price (₵)"
                        type="number"
                        name="cost_price"
                        placeholder='e.g. "1000"'
                        value={product.cost_price.toString()}
                        onChange={(e) => handleProductsInputChange(index, e)}
                        required
                        min="0"
                        step={0.01}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <div className="flex justify-between">
                <Button variant="outline" onClick={addProductForm} type="button">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another Product
                </Button>
              </div>
            </div>
          </form>
        )}
      </Dialog>

      <Dialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Confirm Delete"
        color="error"
        actions={
          <>
            <Button variant="tonal" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button loading={isDeleting} variant="tonal" onClick={confirmDelete} color="error" disabled={isDeleting}>
              Delete
            </Button>
          </>
        }
      >
        <p>Are you sure you want to delete the product "{deletingProduct?.name}"? This action cannot be undone.</p>
      </Dialog>
    </div>
  )
}

export default ProductsPage