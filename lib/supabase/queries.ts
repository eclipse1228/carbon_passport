import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/types/database'

type Passport = Database['public']['Tables']['passports']['Row']
type PassportInsert = Database['public']['Tables']['passports']['Insert']
type Route = Database['public']['Tables']['routes']['Row']
type RouteInsert = Database['public']['Tables']['routes']['Insert']
type Station = Database['public']['Tables']['stations']['Row']
type SurveyResponse = Database['public']['Tables']['survey_responses']['Row']
type SurveyResponseInsert = Database['public']['Tables']['survey_responses']['Insert']

const supabase = createClient()

// Station queries
export async function getStations(locale: 'ko' | 'en' | 'ja' | 'zh' = 'ko') {
  const nameField = `name_${locale}` as keyof Station
  
  const { data, error } = await supabase
    .from('stations')
    .select('*')
    .eq('is_active', true)
    .order(nameField as string)
  
  if (error) throw error
  return data
}

export async function getStation(code: string) {
  const { data, error } = await supabase
    .from('stations')
    .select('*')
    .eq('code', code)
    .single()
  
  if (error) throw error
  return data
}

// Passport queries
export async function createPassport(passport: PassportInsert) {
  const { data, error } = await supabase
    .from('passports')
    .insert(passport)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function getPassportByShareHash(shareHash: string) {
  const { data, error } = await supabase
    .from('passports')
    .select('*, routes(*), survey_responses(*)')
    .eq('share_hash', shareHash)
    .single()
  
  if (error) throw error
  return data
}

export async function updatePassportPhoto(passportId: string, photoUrl: string) {
  const { data, error } = await supabase
    .from('passports')
    .update({ photo_url: photoUrl })
    .eq('id', passportId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function generateShareLink(passportId: string) {
  // Generate share hash using Supabase function
  const { data: hashData, error: hashError } = await supabase
    .rpc('generate_share_hash')
  
  if (hashError) throw hashError
  
  // Update passport with share hash
  const { data, error } = await supabase
    .from('passports')
    .update({ share_hash: hashData })
    .eq('id', passportId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Route queries
export async function createRoute(route: RouteInsert) {
  const { data, error } = await supabase
    .from('routes')
    .insert(route)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function createRoutes(routes: RouteInsert[]) {
  const { data, error } = await supabase
    .from('routes')
    .insert(routes)
    .select()
  
  if (error) throw error
  return data
}

export async function getRoutesByPassport(passportId: string) {
  const { data, error } = await supabase
    .from('routes')
    .select('*')
    .eq('passport_id', passportId)
    .order('sequence_order')
  
  if (error) throw error
  return data
}

// Survey queries
export async function createSurveyResponse(survey: SurveyResponseInsert) {
  const { data, error } = await supabase
    .from('survey_responses')
    .insert(survey)
    .select()
    .single()
  
  if (error) throw error
  return data
}

export async function updateSurveyResponse(
  passportId: string, 
  responses: any, 
  completed: boolean = false
) {
  const { data, error } = await supabase
    .from('survey_responses')
    .update({ 
      responses, 
      completed,
      completed_at: completed ? new Date().toISOString() : null 
    })
    .eq('passport_id', passportId)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Storage functions
export async function uploadPassportPhoto(file: File, passportId: string) {
  const { validateImageFile, generatePhotoFileName, ensureStorageBucket, getPhotoPublicUrl } = await import('@/lib/utils/storage-setup')
  
  // Validate the image file
  const validation = validateImageFile(file)
  if (!validation.isValid) {
    throw new Error(validation.error)
  }
  
  // Ensure the storage bucket exists
  const bucketReady = await ensureStorageBucket()
  if (!bucketReady) {
    throw new Error('Storage bucket is not available')
  }
  
  // Generate optimized file name
  const fileName = generatePhotoFileName(passportId, file.name)
  
  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from('passport-photos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    })
  
  if (uploadError) {
    console.error('Storage upload error:', uploadError)
    throw new Error(`파일 업로드 실패: ${uploadError.message}`)
  }
  
  // Get public URL
  const publicUrl = await getPhotoPublicUrl(fileName)
  
  return publicUrl
}

export async function deletePassportPhoto(photoUrl: string) {
  // Extract file path from URL
  const url = new URL(photoUrl)
  const pathParts = url.pathname.split('/')
  const filePath = pathParts[pathParts.length - 1]
  
  const { error } = await supabase.storage
    .from('passport-photos')
    .remove([filePath])
  
  if (error) throw error
  return true
}