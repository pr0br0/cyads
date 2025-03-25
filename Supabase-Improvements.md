# Supabase Integration Improvements

## 1. Security Enhancements
```typescript
// Move sensitive defaults to environment variables only
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}
```

## 2. Real-time Subscriptions
```typescript
// Add real-time functionality
export function subscribeToAds(
  callback: (payload: RealtimePostgresChangesPayload<Ad>) => void
) {
  return supabase
    .channel('ads-changes')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'ads' },
      callback
    )
    .subscribe()
}
```

## 3. Enhanced Error Handling
```typescript
// Create error handling wrapper
export async function safeQuery<T>(query: Promise<PostgrestResponse<T>>) {
  const { data, error } = await query
  if (error) {
    console.error('Supabase error:', error)
    throw error
  }
  return data
}
```

## 4. Row Level Security (RLS) Policies
- Verify all tables have proper RLS policies
- Add client-side validation for sensitive operations

## 5. Storage Integration
```typescript
// Add storage helper functions
export async function uploadAdImage(file: File, userId: string) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${Math.random()}.${fileExt}`
  
  const { error } = await supabase.storage
    .from('ad-images')
    .upload(fileName, file)

  if (error) throw error

  return supabase.storage
    .from('ad-images')
    .getPublicUrl(fileName)
}
```

## Implementation Steps:
1. Update environment variables
2. Add real-time subscriptions where needed
3. Implement the error handling wrapper
4. Verify RLS policies in Supabase dashboard
5. Add storage functions for file uploads

## Verification:
- Test all data fetching operations
- Verify real-time updates work
- Check error cases are handled properly
- Test image uploads/downloads
