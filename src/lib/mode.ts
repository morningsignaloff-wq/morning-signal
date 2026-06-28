/** Local mode activates when Supabase is not configured — zero API keys needed. */
export function isLocalMode(): boolean {
  return !process.env.NEXT_PUBLIC_SUPABASE_URL;
}
