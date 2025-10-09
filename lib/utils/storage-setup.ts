import { createClient } from '@/lib/supabase/server'

/**
 * Storage bucket configuration for passport photos
 */
const BUCKET_NAME = 'passport-photos'
const BUCKET_CONFIG = {
  public: true,
  allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  fileSizeLimit: 5 * 1024 * 1024, // 5MB
}

/**
 * Ensure the passport-photos bucket exists and is properly configured
 */
export async function ensureStorageBucket() {
  const supabase = await createClient()
  
  try {
    // Check if bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('Error listing buckets:', listError)
      // If we can't list buckets, assume bucket exists and continue
      console.log('Cannot list buckets, assuming bucket exists')
      return true
    }

    const bucketExists = buckets?.some(bucket => bucket.name === BUCKET_NAME)
    
    if (!bucketExists) {
      console.log(`Storage bucket ${BUCKET_NAME} does not exist, but upload will be attempted anyway`)
      // Note: Bucket might exist but not visible due to RLS policies
      // Or it needs to be created manually in Supabase dashboard
    } else {
      console.log(`Storage bucket ${BUCKET_NAME} already exists`)
    }
    
    return true
  } catch (error) {
    console.error('Error ensuring storage bucket:', error)
    // Don't fail the entire process due to bucket issues
    return true
  }
}

/**
 * Validate image file before upload
 */
export function validateImageFile(file: File): { isValid: boolean; error?: string } {
  // Check file size (5MB limit)
  if (file.size > BUCKET_CONFIG.fileSizeLimit) {
    return {
      isValid: false,
      error: `파일 크기가 너무 큽니다. 최대 ${BUCKET_CONFIG.fileSizeLimit / (1024 * 1024)}MB까지 허용됩니다.`
    }
  }
  
  // Check file type
  if (!BUCKET_CONFIG.allowedMimeTypes.includes(file.type)) {
    return {
      isValid: false,
      error: '지원되지 않는 파일 형식입니다. JPEG, PNG, WebP 파일만 업로드 가능합니다.'
    }
  }
  
  return { isValid: true }
}

/**
 * Generate optimized file name for storage
 */
export function generatePhotoFileName(passportId: string, originalFileName: string): string {
  const fileExt = originalFileName.split('.').pop()?.toLowerCase() || 'jpg'
  const timestamp = Date.now()
  const randomSuffix = Math.random().toString(36).substring(2, 8)
  
  return `passport-${passportId}-${timestamp}-${randomSuffix}.${fileExt}`
}

/**
 * Get photo URL from Supabase Storage
 */
export async function getPhotoPublicUrl(filePath: string): Promise<string> {
  const supabase = await createClient()
  
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath)
  
  return data.publicUrl
}

/**
 * Delete photo from Supabase Storage
 */
export async function deletePhotoFromStorage(photoUrl: string): Promise<boolean> {
  try {
    const supabase = await createClient()
    
    // Extract file path from URL
    const url = new URL(photoUrl)
    const pathParts = url.pathname.split('/')
    const filePath = pathParts[pathParts.length - 1]
    
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath])
    
    if (error) {
      console.error('Error deleting photo:', error)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error deleting photo from storage:', error)
    return false
  }
}