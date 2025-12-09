'use client'

import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Plus, Edit, Trash2, Tag, Layers, Package } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table } from '@/components/ui/table'
import { Dialog } from '@/components/ui/dialog'
import Input from '@/components/ui/Input-field'
import { Textarea } from '@/components/ui/text-area'
import { Skeleton } from '@/components/ui/skeleton'
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '@/store/slices/categoriesSlice'
import { RootState, AppDispatch } from '@/store/store'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'

const CategoriesPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { user } = useAuth()
  const { categories: categoriesData, loading, error } = useSelector((state: RootState) => state.categories)
  const categories = Array.isArray(categoriesData) ? categoriesData : []
  const { showToast } = useToast()

  const [currentPage, setCurrentPage] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add')
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletingCategory, setDeletingCategory] = useState<{ id: string; name: string } | null>(null)
  const [categoryForm, setCategoryForm] = useState({
    id: '',
    name: '',
    description: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (user?.token) {
      dispatch(fetchCategories(user.token))
    }
  }, [dispatch, user?.token])

  console.log('categories', categories)

  const formattedCategories = categories.map(cat => ({
    ...cat,
    created_at: cat.created_at ? new Date(cat.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'
  }))

  const columns = [
    { key: 'name' as const, label: 'Name', sortable: true },
    { key: 'description' as const, label: 'Description' },
    { key: 'products' as const, label: 'Total Products', sortable: true },
    { key: 'created_at' as const, label: 'Created At' },
  ]

  const totalProducts = categories.reduce((sum, cat) => sum + (cat.products || 0), 0)
  const totalCategories = categories.length

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCategoryForm(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmitCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (user?.token) {
      setIsSubmitting(true)
      try {
        let result
        if (modalMode === 'add') {
          result = await dispatch(createCategory({ token: user.token, category: { name: categoryForm.name, description: categoryForm.description } })).unwrap()
          showToast(result?.info || 'Category created successfully!', 'success')
        } else {
          result = await dispatch(updateCategory({ token: user.token, uid: categoryForm.id, category: { name: categoryForm.name, description: categoryForm.description } })).unwrap()
          showToast(result?.info || 'Category updated successfully!', 'success')
        }

        dispatch(fetchCategories(user.token))

        setShowModal(false)
        setCategoryForm({
          id: '',
          name: '',
          description: '',
        })
      } catch (error: any) {
        console.error(`Failed to ${modalMode} category:`, error)
        showToast(error.response?.data?.detail || `Failed to ${modalMode} category`, 'error')
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const handleEditCategory = (category: any) => {
    setCategoryForm({
      id: category.uid,
      name: category.name,
      description: category.description || '',
    })
    setModalMode('edit')
    setShowModal(true)
  }

  const handleAddCategory = () => {
    setCategoryForm({
      id: '',
      name: '',
      description: '',
    })
    setModalMode('add')
    setShowModal(true)
  }

  const handleDeleteCategory = (category: any) => {
    setDeletingCategory({ id: category.uid, name: category.name })
    setShowDeleteConfirm(true)
  }

  const confirmDelete = async () => {
    if (user?.token && deletingCategory) {
      setIsDeleting(true)
      try {
        await dispatch(deleteCategory({ token: user.token, uid: deletingCategory.id })).unwrap()
        showToast( 'Category deleted successfully!', 'success')

        dispatch(fetchCategories(user.token))

        setShowDeleteConfirm(false)
        setDeletingCategory(null)
      } catch (error: any) {
        console.error('Failed to delete category:', error)
        showToast(error?.message || 'Failed to delete category', 'error')
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const headerActions = (
    <div className="flex gap-4">
      <Button startIcon={<Plus className="h-4 w-4" />} onClick={handleAddCategory}>
        Add Category
      </Button>
    </div>
  )

  const actions = (item: any) => (
    <div className="flex space-x-2">
      <Button variant="ghost" color="info" size="icon" onClick={() => handleEditCategory(item)} startIcon={<Edit className="h-4 w-4" />} />
      <Button variant="ghost" color="error" size="icon" onClick={() => handleDeleteCategory(item)} startIcon={<Trash2 className="h-4 w-4" />} />
    </div>
  )

  const SummaryCard = ({ icon: Icon, label, value, subtext, pattern }: any) => (
    <div className="rounded-lg bg-card border border-border p-6 transition-all hover:shadow-md overflow-hidden relative">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        {pattern === 'dots' && (
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="dots" x="20" y="20" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="2" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" className="text-primary" />
          </svg>
        )}
        {pattern === 'grid' && (
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid" x="20" y="20" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" className="text-primary" />
          </svg>
        )}
        {pattern === 'diagonal' && (
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="diagonal" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                <line x1="0" y1="0" x2="0" y2="20" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#diagonal)" className="text-primary" />
          </svg>
        )}
      </div>

      <div className="relative z-10 flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {subtext && <p className="text-xs text-muted-foreground pt-1">{subtext}</p>}
        </div>
        <div className="rounded-lg bg-primary/10 p-3">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center" style={{ animation: `fadeInUp 0.6s ease-out 0s both` }}>
        {loading ? (
          <Skeleton className="h-10 w-32 rounded-lg" />
        ) : (
          (
            <div>
              <h1 className="text-2xl font-bold">Categories</h1>
              <p className="text-sm text-muted-foreground">Manage product categories</p>
            </div>
        )
        )}

        {loading ? (
          <Skeleton className="h-10 w-32 rounded-lg" />
        ) : (
          (
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0">
              {headerActions}
            </div>
        )
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" style={{ animation: `fadeInUp 0.6s ease-out 0.1s both` }}>
        {loading ? (
          <>
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
            <Skeleton className="h-32 rounded-lg" />
          </>
        ) : (
          <>
            <SummaryCard
              icon={Layers}
              label="Total Categories"
              value={totalCategories}
              subtext={`${totalProducts} products across all categories`}
              pattern="dots"
            />
            <SummaryCard
              icon={Package}
              label="Total Products"
              value={totalProducts}
              subtext={`Average ${totalCategories > 0 ? (totalProducts / totalCategories).toFixed(1) : 0} per category`}
              pattern="grid"
            />
            <SummaryCard
              icon={Tag}
              label="Most Popular"
              value={categories.length > 0 ? categories.reduce((max, cat) => (cat.products || 0) > (max.products || 0) ? cat : max).name : 'N/A'}
              subtext={categories.length > 0 ? `${Math.max(...categories.map(c => c.products || 0))} products` : 'No categories yet'}
              pattern="diagonal"
            />
          </>
        )}
      </div>

      <div className="overflow-hidden rounded-lg bg-card" style={{ animation: `fadeInUp 0.6s ease-out 0.2s both` }}>
        {loading ? (
          <div className="space-y-4 p-4">
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
        ) : (
          <Table
            data={formattedCategories}
            columns={columns}
            searchable
            pagination
            hoverable
            actions={actions}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            itemsPerPage={8}
          />
        )}
      </div>

      <Dialog
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={modalMode === 'add' ? 'Add New Category' : 'Edit Category'}
        size="lg"
        color="primary"
        actions={
          <>
            <Button variant="outline" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button loading={isSubmitting} startIcon={modalMode === 'add' ? <Plus className="h-4 w-4" /> : <Edit className="h-4 w-4" />} onClick={handleSubmitCategory} disabled={isSubmitting}>
              
              {modalMode === 'add' ? 'Add Category' : 'Update Category'}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmitCategory}>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <Input
                label="Category Name"
                type="text"
                name="name"
                placeholder="e.g. Electronics"
                value={categoryForm.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="sm:col-span-6">
              <Textarea
                label="Description"
                name="description"
                placeholder="Describe the category"
                value={categoryForm.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
          </div>
        </form>
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
            <Button loading={isDeleting} variant={'tonal'} onClick={confirmDelete} color="error" disabled={isDeleting}>
              Delete
            </Button>
          </>
        }
      >
        <p>Are you sure you want to delete the category "{deletingCategory?.name}"? This action cannot be undone.</p>
      </Dialog>
    </div>
  )
}

export default CategoriesPage