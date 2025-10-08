'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { useTranslations } from 'next-intl'
import imageCompression from 'browser-image-compression'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PhotoUploadProps {
  onPhotoChange: (file: File | null, url: string | null) => void
  initialPhoto?: string | null
  className?: string
}

export function PhotoUpload({ onPhotoChange, initialPhoto, className }: PhotoUploadProps) {
  const t = useTranslations()
  const [preview, setPreview] = useState<string | null>(initialPhoto || null)
  const [isCompressing, setIsCompressing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (!file) return

    setError(null)
    setIsCompressing(true)

    try {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError(t('validation.fileTooLarge'))
        setIsCompressing(false)
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError(t('validation.invalidFile'))
        setIsCompressing(false)
        return
      }

      // Compression options
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 800,
        useWebWorker: true,
        fileType: 'image/jpeg'
      }

      // Compress the image
      const compressedFile = await imageCompression(file, options)
      
      // Create preview URL
      const previewUrl = URL.createObjectURL(compressedFile)
      setPreview(previewUrl)
      
      // Call parent callback
      onPhotoChange(compressedFile, previewUrl)
      
    } catch (error) {
      console.error('Error compressing image:', error)
      setError(t('error.upload'))
    } finally {
      setIsCompressing(false)
    }
  }, [onPhotoChange, t])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxFiles: 1,
    multiple: false
  })

  const removePhoto = () => {
    if (preview && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview)
    }
    setPreview(null)
    setError(null)
    onPhotoChange(null, null)
  }

  return (
    <div className={cn("space-y-4", className)}>
      {!preview ? (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
            isDragActive 
              ? "border-primary bg-primary/5" 
              : "border-gray-300 hover:border-gray-400",
            isCompressing && "pointer-events-none opacity-50"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center space-y-4">
            {isCompressing ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            ) : (
              <Upload className="h-8 w-8 text-gray-400" />
            )}
            <div>
              <p className="text-lg font-medium">
                {isCompressing ? t('messages.loading') : t('passport.uploadPhoto')}
              </p>
              <p className="text-sm text-gray-500">
                {isDragActive 
                  ? "Drop the image here"
                  : "Click to select or drag and drop"
                }
              </p>
              <p className="text-xs text-gray-400 mt-2">
                JPG, PNG, WebP (max 5MB)
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative">
          <div className="relative overflow-hidden rounded-lg border bg-gray-50">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-48 object-cover"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={removePhoto}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-2 flex items-center">
            <ImageIcon className="h-4 w-4 mr-1" />
            Photo uploaded successfully
          </p>
        </div>
      )}
      
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
    </div>
  )
}