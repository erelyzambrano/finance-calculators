import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Share2 } from 'lucide-react'
import { copyShareUrl } from './utils'

export default function CalculatorLayout({ 
  title, 
  children, 
  shareParams 
}) {
  const navigate = useNavigate()
  
  const handleShare = () => {
    const path = window.location.pathname
    copyShareUrl(path, shareParams)
  }
  
  return (
    <div className="min-h-screen bg-cream bg-grain">
      <header className="border-b border-border bg-cream/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-forest-tint rounded-sm transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-forest" />
            </button>
            <div>
              <h1 className="text-2xl font-fraunces italic text-ink">{title}</h1>
            </div>
          </div>
          
          <button
            onClick={handleShare}
            className="p-2 hover:bg-copper-tint rounded-sm transition-colors flex items-center gap-2 text-sm text-ink-mute hover:text-ink"
          >
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {children}
      </main>

      <footer className="border-t border-border py-6 mt-16 text-center text-xs text-ink-mute">
        <p>For illustrative purposes only. Not financial advice.</p>
      </footer>
    </div>
  )
}
