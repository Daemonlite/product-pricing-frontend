'use client'

import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Save, Shield, Users, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Table } from '@/components/ui/table'
import { Dialog } from '@/components/ui/dialog'
import Input from '@/components/ui/Input-field'
import { Select } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppSelector } from '@/store/hooks'
import { RootState, AppDispatch } from '@/store/store'
import { fetchUsers, createUser, updateUser, deleteUser } from '@/store/slices/usersSlice'
import { fetchRoles, createRole } from '@/store/slices/rolesSlice'
import { useAuth } from '@/context/AuthContext'
import { useToast } from '@/hooks/useToast'
import { useDispatch, useSelector } from 'react-redux'

const UsersPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { users: users, loading, error } = useSelector((state: RootState) => state.users)
  const { user } = useAuth()
  const { showToast } = useToast()

  const [currentPage, setCurrentPage] = useState(1)
  const [showUserModal, setShowUserModal] = useState(false)
  const [showAddRoleModal, setShowAddRoleModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [editingUser, setEditingUser] = useState<typeof users[0] | null>(null)
  const [deletingUser, setDeletingUser] = useState<typeof users[0] | null>(null)
  const [newUser, setNewUser] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    role: '',
  })
  const [newRole, setNewRole] = useState('')
  const { roles } = useAppSelector((state) => state.roles)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isAddingRole, setIsAddingRole] = useState(false)

  useEffect(() => {
    if (user?.token) {
      dispatch(fetchUsers(user.token))
      dispatch(fetchRoles(user.token))
    }
  }, [dispatch, user?.token])

  const columns = [
    { key: 'first_name' as const, label: 'First Name', sortable: true },
    { key: 'last_name' as const, label: 'Last Name', sortable: true },
    { key: 'email' as const, label: 'Email' },
    { key: 'role_name' as const, label: 'Role', sortable: true },
  ]

  const totalUsers = users.length
  const activeUsers = users.filter(u => u.role_name === 'super_admin').length
  const adminCount = users.filter(u => u.role_name === 'super_admin').length

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewUser(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.token) return
    setIsSubmitting(true)
    try {
      let result
      if (editingUser) {
        result = await dispatch(updateUser({ token: user.token, uid: editingUser.uid!, user: newUser })).unwrap()
        showToast(result?.info || 'User updated successfully!', 'success')
      } else {
        result = await dispatch(createUser({ token: user.token, user: newUser })).unwrap()
        showToast(result?.info || 'User created successfully!', 'success')
      }

      dispatch(fetchUsers(user.token))

      setShowUserModal(false)
      setEditingUser(null)

      setNewUser({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: '',
        role: '',
      })
    } catch (error: any) {
      console.error('Failed to save user:', error)
      showToast(error.response?.data?.detail || 'Failed to save user', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditUser = (userToEdit: typeof users[0]) => {
    const roleId = roles?.find(r => r.name === userToEdit.role_name)?.id || ''
    setEditingUser(userToEdit)
    setNewUser({
      first_name: userToEdit.first_name || '',
      last_name: userToEdit.last_name || '',
      email: userToEdit.email,
      phone_number: userToEdit.phone_number || '',
      role: roleId,
    })
    setShowUserModal(true)
  }

  const handleDeleteUser = (userToDelete: typeof users[0]) => {
    setDeletingUser(userToDelete)
    setShowDeleteModal(true)
  }

  const confirmDeleteUser = async () => {
    if (!user?.token || !deletingUser?.uid) return
    setIsDeleting(true)
    try {
      await dispatch(deleteUser({ token: user.token, id: deletingUser.uid })).unwrap()
      showToast('User deleted successfully!', 'success')

      dispatch(fetchUsers(user.token))

      setShowDeleteModal(false)
      setDeletingUser(null)

    } catch (error: any) {
      console.error('Failed to delete user:', error)
      showToast(error?.message || 'Failed to delete user', 'error')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleAddRole = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user?.token) return
    setIsAddingRole(true)
    if (newRole.trim() && !roles?.some(r => r.name === newRole.trim())) {
      try {
        const result = await dispatch(createRole({ token: user.token, roleName: newRole.trim() })).unwrap()
        setNewRole('')
        setShowAddRoleModal(false)
        showToast(result?.info || 'Role added successfully!', 'success')

        dispatch(fetchRoles(user.token))

        setNewRole('')
        setShowAddRoleModal(false)

      } catch (error: any) {
        console.error('Failed to add role:', error)
        showToast(error?.message || 'Failed to add role. Please try again.', 'error')
      } finally {
        setIsAddingRole(false)
      }
    }
  } 

  const headerActions = (
    <div className="flex gap-4">
      <Button startIcon={<Plus className="h-4 w-4" />} onClick={() => setShowUserModal(true)}>
        Add User
      </Button>
    </div>
  )

  const actions = (item: typeof users[0]) => (
    <div className="flex space-x-2">
      <Button variant="ghost" color={'info'} size="sm" onClick={() => handleEditUser(item)}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="sm" color="error" onClick={() => handleDeleteUser(item)}>
        <Trash2 className="h-4 w-4" />
      </Button>
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
          <div>
            <h1 className="text-2xl font-bold">Users</h1>
            <p className="text-sm text-muted-foreground">Manage user accounts and permissions</p>
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
              icon={Users}
              label="Total Users"
              value={totalUsers}
              subtext={`${activeUsers} active user${activeUsers !== 1 ? 's' : ''}`}
              pattern="dots"
            />
            <SummaryCard
              icon={Activity}
              label="Active Users"
              value={activeUsers}
              subtext={`${((activeUsers / totalUsers) * 100).toFixed(0)}% of total`}
              pattern="grid"
            />
            <SummaryCard
              icon={Shield}
              label="Administrators"
              value={adminCount}
              subtext={`${totalUsers - adminCount} regular user${totalUsers - adminCount !== 1 ? 's' : ''}`}
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
            data={users}
            columns={columns}
            searchable
            pagination
            hoverable
            actions={actions}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
            itemsPerPage={8}
            className='text-nowrap'
          />
        )}
      </div>

      <Dialog
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        title={editingUser ? "Edit User" : "Add New User"}
        size="3xl"
        color="primary"
        actions={
          <>
            <Button variant="outline" onClick={() => setShowUserModal(false)}>
              Cancel
            </Button>
            <Button loading={isSubmitting} startIcon={editingUser ? <Edit className="h-4 w-4" /> : <Save className="h-4 w-4" />} onClick={handleSubmitUser} disabled={isSubmitting}>
              {editingUser ? "Update User" : "Add User"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmitUser}>
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <Input
                label="First Name"
                type="text"
                name="first_name"
                placeholder="e.g. John"
                value={newUser.first_name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="sm:col-span-3">
              <Input
                label="Last Name"
                type="text"
                name="last_name"
                placeholder="e.g. Doe"
                value={newUser.last_name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="sm:col-span-3">
              <Input
                label="Email"
                type="email"
                name="email"
                placeholder="e.g. john.doe@example.com"
                value={newUser.email}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="sm:col-span-3">
              <Input
                label="Phone Number"
                type="tel"
                name="phone_number"
                placeholder="e.g. +1234567890"
                value={newUser.phone_number}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className=" mt-4">
              <div className='flex gap-4'>
                <Select
                  label="Role"
                  clearable
                  placeholder="Select role"
                  options={roles?.map(r => ({ value: r.id, label: r.name })) || []}
                  value={newUser.role}
                  onChange={(val) => setNewUser(prev => ({ ...prev, role: val as string }))}
                />
                <Button className='mt-7' onClick={() => setShowAddRoleModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                </Button>
              </div>
            </div>
        </form>
      </Dialog>

      <Dialog
        isOpen={showAddRoleModal}
        onClose={() => setShowAddRoleModal(false)}
        title="Add New Role"
        size="md"
        color="primary"
        actions={
          <>
            <Button variant="outline" onClick={() => setShowAddRoleModal(false)}>
              Cancel
            </Button>
            <Button loading={isAddingRole} startIcon={<Save className="mr-2 h-4 w-4" />} onClick={handleAddRole}>
              Add Role
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddRole}>
          <div className="space-y-4">
            <Input
              label="Role Name"
              type="text"
              placeholder="e.g. Moderator"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              required
            />
          </div>
        </form>
      </Dialog>

      <Dialog
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Confirm Delete"
        color="error"
        actions={
          <>
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button loading={isDeleting} startIcon={<Trash2 className="mr-2 h-4 w-4" />} variant={'tonal'} color="error" onClick={confirmDeleteUser}>
              Delete User
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p>Are you sure you want to delete the user <strong>{deletingUser?.first_name} {deletingUser?.last_name}</strong>?</p>
          <p className="text-sm text-muted-foreground">This action cannot be undone.</p>
        </div>
      </Dialog>
    </div>
  )
}

export default UsersPage