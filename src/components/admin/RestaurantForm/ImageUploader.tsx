'use client'

import { useState, useRef } from 'react'
import styles from './ImageUploader.module.css'

interface ImageUploaderProps {
  restaurantId: string
  photos: string[]
  onPhotosChange: (photos: string[]) => void
}

export default function ImageUploader({
  restaurantId,
  photos,
  onPhotosChange,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (!restaurantId) {
      setError('Please enter a restaurant name first to generate an ID')
      return
    }

    setIsUploading(true)
    setError(null)

    // Supported image types
    const supportedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif'
    ]

    try {
      const uploadedUrls: string[] = []

      for (const file of Array.from(files)) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          throw new Error(`${file.name} is not an image file`)
        }

        // Check if the image type is supported
        if (!supportedTypes.includes(file.type.toLowerCase())) {
          throw new Error(
            `${file.name} has unsupported format (${file.type}). Supported formats: JPEG, PNG, WebP, GIF`
          )
        }

        // Validate file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          throw new Error(`${file.name} is too large (max 5MB)`)
        }

        const formData = new FormData()
        formData.append('file', file)
        formData.append('restaurantId', restaurantId)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Failed to upload image')
        }

        const data = await response.json()
        uploadedUrls.push(data.url)
      }

      // Add new URLs to existing photos
      onPhotosChange([...photos, ...uploadedUrls])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload images')
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleRemovePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index)
    onPhotosChange(newPhotos)
  }

  const handleAddUrl = () => {
    const url = prompt('Enter image URL:')
    if (url && url.trim()) {
      onPhotosChange([...photos, url.trim()])
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label className={styles.label}>Photos</label>
        <div className={styles.actions}>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || !restaurantId}
            className={styles.uploadButton}
          >
            {isUploading ? 'Uploading...' : 'Upload Images'}
          </button>
          <button
            type="button"
            onClick={handleAddUrl}
            className={styles.urlButton}
          >
            Add URL
          </button>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        multiple
        onChange={handleFileSelect}
        className={styles.fileInput}
      />

      {error && (
        <div className={styles.error}>{error}</div>
      )}

      {!restaurantId && (
        <div className={styles.warning}>
          Enter a restaurant name first to enable image uploads
        </div>
      )}

      {photos.length > 0 ? (
        <div className={styles.photoGrid}>
          {photos.map((photo, index) => (
            <div key={index} className={styles.photoCard}>
              <img
                src={photo}
                alt={`Photo ${index + 1}`}
                className={styles.photo}
              />
              <button
                type="button"
                onClick={() => handleRemovePhoto(index)}
                className={styles.removeButton}
                title="Remove photo"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.empty}>
          No photos yet. Upload images or add URLs.
        </div>
      )}
    </div>
  )
}
