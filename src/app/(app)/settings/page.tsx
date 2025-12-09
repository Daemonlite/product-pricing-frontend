'use client'

import React, { useState } from 'react'
import {
  Settings as SettingsIcon,
  User,
  Bell,
  DollarSign,
  Globe,
  ShieldCheck,
  Save,
  Percent,
  Plus,
  Smartphone,
  Monitor,
  LogOut,
  Circle,
  QrCode,
  Phone,
  Mail,
  Shield,
  Edit,
  CheckCircle,
  Key,
  Lock,
  User2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/Input-field'
import { Checkbox } from '@/components/ui/checkbox'
import { Select } from '@/components/ui/select'
import { Table } from '@/components/ui/table'
import { Chip } from '@/components/ui/chip'
import { Tabs } from '@/components/ui/tabs'
import { ToggleSwitch } from '@/components/ui/toggle-switch'

const SettingsPage: React.FC = () => {
  const [pricingSettings, setPricingSettings] = useState({
    defaultMargin: 25,
    roundPrices: true,
    roundingMethod: 'nearest',
    roundingPrecision: 0.99,
    autoUpdatePrices: false,
    autoUpdateThreshold: 5,
  })
  const [notificationSettings, setNotificationSettings] = useState({
    priceDrop: true,
    marginWarning: true,
    outdatedPrices: true,
    competitorChanges: true,
    emailNotifications: true,
    pushNotifications: false,
  })
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    twoFactorMethod: '',
    email: '',
    phone: '',
  })

  const handlePricingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setPricingSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleNotificationChange = (checked: boolean, name: string) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [name]: checked,
    }))
  }

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would save settings to the backend
    alert('Settings saved successfully!')
  }

  const tabs = [
    {
      id: 'pricing',
      label: 'Pricing Rules',
      startIcon: <DollarSign className="h-5 w-5" />,
      content: (
        <form onSubmit={handleSaveSettings}>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium leading-6 text-foreground">
                Default Pricing Rules
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Configure your default pricing rules for all products
              </p>
            </div>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <Input
                  type="number"
                  name="defaultMargin"
                  label="Default Profit Margin (%)"
                  value={pricingSettings.defaultMargin}
                  onChange={handlePricingChange}
                  min="0"
                  max="100"
                  startIcon={<Percent className="h-4 w-4" />}
                  hint="This margin will be applied to new products by default"
                />
              </div>
              <div className="sm:col-span-3">
                <Checkbox
                  label="Round Prices"
                  checked={pricingSettings.roundPrices}
                  onChange={(checked) =>
                    setPricingSettings((prev) => ({ ...prev, roundPrices: checked }))
                  }
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  Automatically round prices for better marketing presentation
                </p>
              </div>
              {pricingSettings.roundPrices && (
                <>
                  <div className="sm:col-span-3">
                    <Select
                      label="Rounding Method"
                      value={pricingSettings.roundingMethod}
                      onChange={(value) =>
                        setPricingSettings((prev) => ({ ...prev, roundingMethod: value as string }))
                      }
                      options={[
                        { value: 'nearest', label: 'Nearest (e.g., 9.99, 19.99)' },
                        { value: 'down', label: 'Round Down (e.g., 9.95, 19.95)' },
                        { value: 'up', label: 'Round Up (e.g., 10, 20)' },
                      ]}
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <Select
                      label="Rounding Precision"
                      value={pricingSettings.roundingPrecision.toString()}
                      onChange={(value) =>
                        setPricingSettings((prev) => ({ ...prev, roundingPrecision: parseFloat(value as string) }))
                      }
                      options={[
                        { value: '0.99', label: 'X.99 (e.g., 9.99, 19.99)' },
                        { value: '0.95', label: 'X.95 (e.g., 9.95, 19.95)' },
                        { value: '0.90', label: 'X.90 (e.g., 9.90, 19.90)' },
                        { value: '0', label: 'Whole Number (e.g., 10, 20)' },
                      ]}
                    />
                  </div>
                </>
              )}
              <div className="sm:col-span-3">
                <Checkbox
                  label="Auto-Update Prices"
                  checked={pricingSettings.autoUpdatePrices}
                  onChange={(checked) =>
                    setPricingSettings((prev) => ({ ...prev, autoUpdatePrices: checked }))
                  }
                />
                <p className="mt-2 text-sm text-muted-foreground">
                  Automatically adjust prices when competitors change theirs
                </p>
              </div>
              {pricingSettings.autoUpdatePrices && (
                <div className="sm:col-span-3">
                  <Input
                    type="number"
                    name="autoUpdateThreshold"
                    label="Auto-Update Threshold (%)"
                    value={pricingSettings.autoUpdateThreshold}
                    onChange={handlePricingChange}
                    min="0"
                    max="100"
                    hint="Only update prices when competitor changes by at least this percentage"
                  />
                </div>
              )}
            </div>
            <div className="pt-5">
              <div className="flex justify-end space-x-3">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
                <Button type="submit" startIcon={<Save className="h-4 w-4" />}>
                  Save Settings
                </Button>
              </div>
            </div>
          </div>
        </form>
      ),
    },
    
    {
      id: 'notifications',
      label: 'Notifications',
      startIcon: <Bell className="h-5 w-5" />,
      content: (
        <form onSubmit={handleSaveSettings}>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium leading-6 text-foreground">
                Notification Preferences
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Configure which notifications you want to receive
              </p>
            </div>
            <div className="space-y-6">
              <Checkbox
                label="Competitor Price Drops"
                checked={notificationSettings.priceDrop}
                onChange={(checked) => handleNotificationChange(checked, 'priceDrop')}
              />
              <p className="text-muted-foreground">
                Get notified when competitors lower their prices below yours
              </p>

              <Checkbox
                label="Margin Warnings"
                checked={notificationSettings.marginWarning}
                onChange={(checked) => handleNotificationChange(checked, 'marginWarning')}
              />
              <p className="text-muted-foreground">
                Get notified when product margins fall below your target
              </p>

              <Checkbox
                label="Outdated Prices"
                checked={notificationSettings.outdatedPrices}
                onChange={(checked) => handleNotificationChange(checked, 'outdatedPrices')}
              />
              <p className="text-muted-foreground">
                Get notified when prices haven't been updated for a long time
              </p>

              <Checkbox
                label="Competitor Price Changes"
                checked={notificationSettings.competitorChanges}
                onChange={(checked) => handleNotificationChange(checked, 'competitorChanges')}
              />
              <p className="text-muted-foreground">
                Get notified of any significant competitor price changes
              </p>

              <div className="border-t border-border pt-6">
                <h4 className="text-base font-medium text-foreground">
                  Delivery Methods
                </h4>
                <div className="mt-4 space-y-4">
                  <Checkbox
                    label="Email Notifications"
                    checked={notificationSettings.emailNotifications}
                    onChange={(checked) => handleNotificationChange(checked, 'emailNotifications')}
                  />
                  <p className="text-muted-foreground">
                    Receive notifications via email
                  </p>

                  <Checkbox
                    label="Push Notifications"
                    checked={notificationSettings.pushNotifications}
                    onChange={(checked) => handleNotificationChange(checked, 'pushNotifications')}
                  />
                  <p className="text-muted-foreground">
                    Receive browser push notifications
                  </p>
                </div>
              </div>
            </div>
            <div className="pt-5">
              <div className="flex justify-end space-x-3">
                <Button variant="outline" type="button">
                  Cancel
                </Button>
                <Button type="submit" startIcon={<Save className="h-4 w-4" />}>
                  Save Settings
                </Button>
              </div>
            </div>
          </div>
        </form>
      ),
    },

    {
      id: 'account',
      label: 'Account',
      startIcon: <User className="h-5 w-5" />,
      content: (
        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold leading-7 text-foreground">
                Account Information
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Manage your account details and preferences
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
            </div>
          </div>

          {/* Profile Information Card */}
          <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-6 rounded-xl border border-border">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-medium text-foreground">Profile Details</h4>
              <Button variant="outline" size="sm" startIcon={<Edit className="h-4 w-4" />}>
                Edit Profile
              </Button>
            </div>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                  <div className="p-3 rounded-lg bg-muted/50 flex gap-2 items-center">
                    <User2 className="h-4 w-4 text-primary" />
                    <span className="text-foreground">Admin User</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Role</label>
                  <div className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="h-4 w-4 text-primary" />
                      <span className="text-foreground">Administrator</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-primary" />
                    <span className="text-foreground">admin@example.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Password Update Card */}
          <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-6 rounded-xl border border-border">
            <div className="mb-6">
              <h4 className="text-lg font-medium text-foreground mb-2">
                Change Password
              </h4>
              <p className="text-sm text-muted-foreground">
                Update your password to keep your account secure
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-4">
                <Input
                  type="password"
                  label="Current Password"
                  name="current-password"
                  startIcon={<Lock className="h-4 w-4" />}
                  placeholder="Enter current password"
                  variant='filled'
                />
                <Input
                  type="password"
                  label="New Password"
                  name="new-password"
                  startIcon={<Lock className="h-4 w-4" />}
                  placeholder="Enter new password"
                  variant='filled'
                />
                <Input
                  type="password"
                  label="Confirm New Password"
                  name="confirm-password"
                  startIcon={<Lock className="h-4 w-4" />}
                  placeholder="Confirm new password"
                  variant='filled'
                />
              </div>
              
              <div className="flex flex-col justify-center space-y-4 p-4 rounded-lg bg-muted/30 border border-border">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm text-foreground">At least 8 characters</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm text-foreground">One uppercase letter</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm text-foreground">One number or symbol</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-6">
              <Button startIcon={<Key className="h-4 w-4" />}>
                Update Password
              </Button>
            </div>
          </div>
        </div>
      ),
    },

    {
      id: 'security',
      label: 'Security',
      startIcon: <ShieldCheck className="h-5 w-5" />,
      content: (
        <div className="space-y-8">
          {/* Header Section */}
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-xl font-semibold leading-7 text-foreground">
                Security Settings
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Configure your security and access settings
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 text-primary" />
            </div>
          </div>

          {/* Two-Factor Authentication Card */}
          <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-6 rounded-xl border border-border">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h4 className="text-lg font-medium text-foreground mb-2">
                  Two-Factor Authentication
                </h4>
                <p className="text-sm text-muted-foreground">
                  Add an extra layer of security to your account
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <ToggleSwitch
                  checked={securitySettings.twoFactorEnabled}
                  onChange={(checked) => setSecuritySettings((prev) => ({ ...prev, twoFactorEnabled: checked }))}
                />
                <span className="text-sm font-medium text-foreground">
                  {securitySettings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            {securitySettings.twoFactorEnabled && (
              <div className="mt-6 bg-muted/30 border border-border p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Select
                      label="Authentication Method"
                      value={securitySettings.twoFactorMethod}
                      onChange={(value) => setSecuritySettings((prev) => ({ ...prev, twoFactorMethod: value as string }))}
                      options={[
                        { value: '', label: 'Select method' },
                        { value: 'email', label: 'Email Verification' },
                        { value: 'phone', label: 'SMS Authentication' },
                        { value: 'app', label: 'Authenticator App' },
                      ]}
                      startIcon={<Smartphone className="h-4 w-4" />}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    {securitySettings.twoFactorMethod === 'email' && (
                      <Input
                        type="email"
                        label="Verification Email"
                        value={securitySettings.email}
                        onChange={(e) => setSecuritySettings((prev) => ({ ...prev, email: e.target.value }))}
                        startIcon={<Mail className="h-4 w-4" />}
                        placeholder="Enter email for verification"
                      />
                    )}
                    {securitySettings.twoFactorMethod === 'phone' && (
                      <Input
                        type="tel"
                        label="Phone Number"
                        value={securitySettings.phone}
                        onChange={(e) => setSecuritySettings((prev) => ({ ...prev, phone: e.target.value }))}
                        startIcon={<Phone className="h-4 w-4" />}
                        placeholder="Enter phone number for SMS"
                      />
                    )}
                    {securitySettings.twoFactorMethod === 'app' && (
                      <div className="text-center p-4 border-2 border-dashed border-border rounded-lg">
                        <QrCode className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Scan QR code with your authenticator app
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Session Management Card */}
          <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-6 rounded-xl border border-border">
            <h4 className="text-lg font-medium text-foreground mb-6">
              Session Management
            </h4>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-foreground">Auto Logout</p>
                  <p className="text-sm text-muted-foreground">
                    Automatically log out after 30 minutes of inactivity
                  </p>
                </div>
                <ToggleSwitch checked={true} />
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex-1">
                  <p className="font-medium text-foreground">Login Notifications</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified of new sign-ins from unknown devices
                  </p>
                </div>
                <ToggleSwitch checked={true} />
              </div>
            </div>
          </div>

          {/* Active Sessions Card */}
          <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-6 rounded-xl border border-border">
            <div className="flex items-center justify-between mb-6">
              <h4 className="text-lg font-medium text-foreground">Active Sessions</h4>
              <Button variant="outline" size="sm" startIcon={<LogOut className="h-4 w-4" />}>
                Logout All Devices
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-success/10 border border-success/20">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-success/20 flex items-center justify-center">
                    <Monitor className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Current Session</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>Started: Today, 10:30 AM</span>
                      <span>•</span>
                      <span>IP: 192.168.1.1</span>
                      <span>•</span>
                      <span>Chrome on Windows</span>
                    </div>
                  </div>
                </div>
                <Chip variant="filled" color="success" startIcon={<Circle className="h-2 w-2 fill-current" />}>
                  Active
                </Chip>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <Smartphone className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Mobile Device</p>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>Last active: 2 hours ago</span>
                      <span>•</span>
                      <span>IP: 192.168.1.2</span>
                      <span>•</span>
                      <span>Safari on iOS</span>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="sm" color="error">
                  Revoke
                </Button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-border">
            <Button variant="outline" type="button">
              Cancel Changes
            </Button>
            <Button startIcon={<Save className="h-4 w-4" />}>
              Save Security Settings
            </Button>
          </div>
        </div>
      ),
    }
  ]

  return (
    <div className="space-y-6">
      <div style={{ animation: `fadeInUp 0.6s ease-out 0s both` }}>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Configure your pricing automation and notification preferences
        </p>
      </div>
      <div className="card" style={{ animation: `fadeInUp 0.6s ease-out 0.1s both` }}>
        <Tabs variant='filled' tabs={tabs} />
      </div>
    </div>
  )
}

export default SettingsPage
