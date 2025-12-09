'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/Input-field'
import { Shield, ArrowLeft, CheckCircle, Clock } from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { useRouter } from 'next/navigation'

const VerifyOtpPage: React.FC = () => {
  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isVerified, setIsVerified] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [canResend, setCanResend] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const { verifyOTP, sendOTP } = useAuth()
  const { showToast } = useToast()
  const router = useRouter()

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setCanResend(true)
          if (timerRef.current) clearInterval(timerRef.current)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.length !== 5) {
      showToast('Please enter a valid 5-digit OTP', 'error')
      return
    }

    setIsLoading(true)
    try {
      const result = await verifyOTP(otp)
      if (result.success) {
        showToast(result.message || 'OTP verified', 'success')
        setIsVerified(true)
        // Redirect to update password after a short delay
        setTimeout(() => {
          router.push('/update-password')
        }, 2000)
      } else {
        showToast(result.error || 'OTP verification failed', 'error')
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Network error. Please try again.'
      showToast(errorMessage, 'error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    const email = localStorage.getItem('resetEmail')
    if (!email) {
      showToast('Email not found. Please restart the process.', 'error')
      return
    }

    setTimeLeft(300)
    setCanResend(false)
    setOtp('')

    try {
      const result = await sendOTP(email)
      if (result.success) {
        showToast(result.message || 'OTP resent', 'success')
      } else {
        showToast(result.error || 'Failed to resend OTP', 'error')
      }
    } catch (error: any) {
      const errorMessage = error.message || 'Network error. Please try again.'
      showToast(errorMessage, 'error')
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
            {!isVerified ? (
              <>
                {/* Header section */}
                <div className="text-center space-y-2">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-lg bg-primary/10 mb-4">
                    <img src="/images/Eco.jpg" alt="logo" />
                  </div>
                  <h1 className="text-3xl font-bold text-foreground">Verify OTP</h1>
                  <p className="text-muted-foreground text-sm">
                    Enter the 6-digit code we sent to your email
                  </p>
                </div>

                {/* Timer */}
                <div className={`flex items-center justify-center gap-2 p-3 rounded-lg ${timeLeft > 60 ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-orange-500/10 border border-orange-500/20'}`}>
                  <Clock className={`h-4 w-4 ${timeLeft > 60 ? 'text-blue-500' : 'text-orange-500'}`} />
                  <span className={`text-sm font-semibold ${timeLeft > 60 ? 'text-blue-600' : 'text-orange-600'}`}>
                    {formatTime(timeLeft)} remaining
                  </span>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      label="OTP Code"
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 5))}
                      placeholder="000000"
                      required
                      className="text-center text-2xl tracking-widest font-mono"
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      {otp.length}/6 digits entered
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-11 font-semibold transition-all duration-300"
                    loading={isLoading}
                    disabled={isLoading || otp.length !== 5}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                        Verify OTP
                  </Button>
                </form>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                </div>

                {/* Resend section */}
                <div className="text-center space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the code?
                  </p>
                  {canResend ? (
                    <Button 
                      onClick={handleResend} 
                      variant="outline" 
                      className="w-full"
                    >
                      Resend OTP
                    </Button>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Resend available in {formatTime(timeLeft)}
                    </p>
                  )}
                </div>

                {/* Footer link */}
                <Link 
                  href="/forgot-password" 
                  className="inline-flex items-center justify-center w-full text-sm text-primary hover:underline transition-colors"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Forgot Password
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
                    <h2 className="text-2xl font-bold text-foreground">OTP Verified</h2>
                    <p className="text-muted-foreground text-sm">
                      Your email has been verified successfully. You can now reset your password.
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-4">
                  <Link href="/update-password" className="block">
                    <Button className="w-full h-11 font-semibold">
                      Reset Password
                    </Button>
                  </Link>
                  <Link href="/login" className="block">
                    <Button variant="outline" className="w-full h-11">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Login
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Bottom text */}
        <p className="text-xs text-muted-foreground text-center mt-6">
          Having trouble? <a href="/support" className="text-primary hover:underline">Contact support</a>
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

export default VerifyOtpPage