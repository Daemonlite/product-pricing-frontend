'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {

  return (
    <div className="flex items-center justify-center bg-background overflow-hidden relative min-h-screen">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 text-center space-y-8 px-4">
        {/* 404 Number with animation */}
        <div className="space-y-4">
          <div className="inline-block">
            <h1 className="text-7xl sm:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70 animate-fade-in">
              404
            </h1>
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Page Not Found</h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
              Looks like you've ventured into uncharted territory. The page you're looking for has either moved on to greener pastures or never existed.
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
          <Link href="/" className="w-full sm:w-auto">
            <Button size={'lg'} startIcon={<Home className="h-4 w-4" />} className="w-full sm:w-auto" >
              Go Home
            </Button>
          </Link>
          <Button
            variant="outline"
            size={'lg'}
            className="w-full sm:w-auto"
            onClick={() => window.history.back()}
            startIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Go Back
          </Button>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  )
}
