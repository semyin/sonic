import { useEffect } from 'react'
import { X, AlertCircle, CheckCircle, Info } from 'lucide-react'
import { cn } from '@/utils/cn'

export type ToastType = 'success' | 'error' | 'info'

interface ToastProps {
  message: string
  type?: ToastType
  onClose: () => void
  duration?: number
}

export function Toast({ message, type = 'info', onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  }

  const Icon = icons[type]

  return (
    <div
      className={cn(
        'fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg border animate-in slide-in-from-top-2 fade-in-0',
        {
          'bg-white border-gray-200': type === 'info',
          'bg-green-50 border-green-200': type === 'success',
          'bg-red-50 border-red-200': type === 'error',
        }
      )}
    >
      <Icon
        className={cn('h-4 w-4 flex-shrink-0', {
          'text-gray-600': type === 'info',
          'text-green-600': type === 'success',
          'text-red-600': type === 'error',
        })}
      />
      <p
        className={cn('text-sm font-medium', {
          'text-gray-900': type === 'info',
          'text-green-900': type === 'success',
          'text-red-900': type === 'error',
        })}
      >
        {message}
      </p>
      <button
        onClick={onClose}
        className={cn('ml-2 p-0.5 rounded hover:bg-black/5 transition-colors cursor-pointer', {
          'text-gray-400 hover:text-gray-600': type === 'info',
          'text-green-400 hover:text-green-600': type === 'success',
          'text-red-400 hover:text-red-600': type === 'error',
        })}
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
