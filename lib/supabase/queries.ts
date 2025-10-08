import { createClient } from '@/lib/supabase/client'

// Temporary type definitions for deployment
type Passport = any
type PassportInsert = any
type Route = any
type RouteInsert = any
type Station = any
type SurveyResponse = any
type SurveyResponseInsert = any

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
export async function createPassport(passport: any) {
  const { data, error } = await (supabase as any)
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
  const { data, error } = await (supabase as any)
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
  const fileExt = file.name.split('.').pop()
  const fileName = `${passportId}-${Date.now()}.${fileExt}`
  const filePath = `${fileName}`
  
  const { error: uploadError } = await supabase.storage
    .from('passport-photos')
    .upload(filePath, file)
  
  if (uploadError) throw uploadError
  
  const { data: { publicUrl } } = supabase.storage
    .from('passport-photos')
    .getPublicUrl(filePath)
  
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