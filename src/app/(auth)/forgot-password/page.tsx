'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/Input-field'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { sendOTP } = useAuth()
  const { showToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) {
      showToast('Please enter your email address', 'error')
      return
    }

    setIsLoading(true)
    try {
      const result = await sendOTP(email)
      if (result.success) {
        localStorage.setItem('resetEmail', email)
        showToast(result.message || 'Reset OTP sent', 'success')
        setIsSubmitted(true)
      } else {
        showToast(result.error || 'Failed to send reset OTP', 'error')
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Network error. Please try again.'
      showToast(errorMessage, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      </div>

      <div className="w-full relative z-10 px-4">
        {/* Card container */}
        <div className="rounded-2xl bg-card border border-border shadow-lg overflow-hidden w-[500px] mx-auto">
          {/* Header gradient */}
          <div className="h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent"></div>

          <div className="p-8 space-y-6">
            {!isSubmitted ? (
              <>
                {/* Header section */}
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-lg bg-primary/10 mb-4">
                    <img src="/images/Eco.jpg" alt="logo" />
                  </div>
                  <h1 className="text-3xl font-bold text-foreground">Forgot Password?</h1>
                  <p className="text-muted-foreground text-sm">
                    No worries! Enter your email address and we'll send you an OTP to reset your password.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      label="Email Address"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-11 font-semibold transition-all duration-300"
                    loading={isLoading}
                    disabled={isLoading}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                        Send Reset OTP
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
                    <h2 className="text-2xl font-bold text-foreground">Check Your Email</h2>
                    <p className="text-muted-foreground text-sm">
                      We've sent a password reset link to <span className="font-semibold text-foreground">{email}</span>
                    </p>
                  </div>

                  <div className="bg-muted rounded-lg p-4 mt-6">
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold text-foreground">Tip:</span> Check your spam folder if you don't see the email within a few minutes.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="py-4">
                  <Link href="/verify-otp" className="block">
                    <Button
                      className="w-full h-11"
                    >
                      Verify OTP
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom text */}
        <p className="text-xs text-muted-foreground text-center mt-6">
          Questions? <a href="/support" className="text-primary hover:underline">Contact our support team</a>
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

export default ForgotPasswordPage