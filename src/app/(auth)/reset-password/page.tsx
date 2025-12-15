'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/Input-field'
import { Lock, ArrowLeft, CheckCircle, AlertCircle, Check, X } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { useRouter } from 'next/navigation'

const ResetPasswordPage: React.FC = () => {
  const { resetPassword, user } = useAuth()
  const { showToast } = useToast()

  const [password, setNewPassword] = useState('')
  const [confirm_password, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState('')

  // Password strength indicators
  const passwordRequirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*]/.test(password),
  }

  const allRequirementsMet = Object.values(passwordRequirements).every(req => req)
  const passwordsMatch = password && confirm_password && password === confirm_password

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!allRequirementsMet) {
      setError('Password does not meet all requirements')
      return
    }

    if (!passwordsMatch) {
      setError('Passwords do not match')
      return
    }

    setIsLoading(true)
    try {
      const result = await resetPassword(user?.email || '', password, confirm_password)
      if (result.success) {
        setIsSuccess(true)
        showToast(result.message || 'Password Reset Successful', 'success')
      } else {
        setError(result.error || 'Failed to reset password')
      }
    } catch (error : any) {
      const errorMessage = error.message || 'Network error. Please try again.'
      showToast(errorMessage, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const RequirementItem = ({ met, label }: { met: boolean; label: string }) => (
    <div className="flex items-center gap-2 text-sm">
      {met ? (
        <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
      ) : (
        <X className="h-4 w-4 text-muted-foreground flex-shrink-0" />
      )}
      <span className={met ? 'text-foreground' : 'text-muted-foreground'}>
        {label}
      </span>
    </div>
  )

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="w-full relative z-10 px-4">
        {/* Card container */}
        <div className="rounded-2xl bg-card border border-border shadow-lg overflow-hidden md:w-[500px] mx-auto">
          {/* Header gradient */}
          <div className="h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent"></div>

          <div className="p-8 space-y-6">
            {!isSuccess ? (
              <>
                {/* Header section */}
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-lg bg-primary/10 mb-4">
                    <img src="/images/Eco.jpg" alt="logo" />
                  </div>
                  <h1 className="text-3xl font-bold text-foreground">Reset Password</h1>
                  <p className="text-muted-foreground text-sm">
                    Create a strong password to secure your account
                  </p>
                </div>

                {/* Error message */}
                {error && (
                  <div className="flex gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
                    <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* New Password */}
                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        label="New Password"
                        type='password'
                        value={password}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                    </div>

                    {/* Password strength requirements */}
                    {password && (
                      <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                        <p className="text-xs font-semibold text-foreground">Password Requirements:</p>
                        <div className="space-y-2">
                          <RequirementItem met={passwordRequirements.length} label="At least 8 characters" />
                          <RequirementItem met={passwordRequirements.uppercase} label="One uppercase letter" />
                          <RequirementItem met={passwordRequirements.lowercase} label="One lowercase letter" />
                          <RequirementItem met={passwordRequirements.number} label="One number" />
                          <RequirementItem met={passwordRequirements.special} label="One special character (!@#$%^&*)" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        label="Confirm Password"
                        type='password'
                        value={confirm_password}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                    </div>

                    {/* Password match indicator */}
                    {confirm_password && (
                      <div className={`flex items-center gap-2 p-3 rounded-lg ${passwordsMatch ? 'bg-green-500/10 border border-green-500/20' : 'bg-red-500/10 border border-red-500/20'}`}>
                        {passwordsMatch ? (
                          <>
                            <Check className="h-4 w-4 text-green-500" />
                            <span className="text-sm text-green-600 font-medium">Passwords match</span>
                          </>
                        ) : (
                          <>
                            <X className="h-4 w-4 text-red-500" />
                            <span className="text-sm text-red-600 font-medium">Passwords do not match</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-11 font-semibold transition-all duration-300"
                    loading={isLoading}
                    disabled={isLoading || !allRequirementsMet || !passwordsMatch}
                  >
                    <Lock className="mr-2 h-4 w-4" />
                        Reset Password
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                </div>

                {/* Footer link */}
                <Link 
                  href="/login" 
                  className="inline-flex items-center justify-center w-full text-sm text-primary hover:underline transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Link>
              </>
            ) : (
              <>
                {/* Success state */}
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 animate-fade-in">
                      <CheckCircle className="h-8 w-8 text-green-500" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-2xl font-bold text-foreground">Password Reset</h2>
                    <p className="text-muted-foreground text-sm">
                      Your password has been successfully Changed. You can now log in with your new password.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-4">
                  <Link href="/login" className="block">
                    <Button className="w-full h-11 font-semibold">
                      <Lock className="mr-2 h-4 w-4" />
                      Log In
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom text */}
        <p className="text-xs text-muted-foreground text-center mt-6">
          Need help? <a href="/support" className="text-primary hover:underline">Contact support</a>
        </p>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default ResetPasswordPage
