"use client"

import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import type { SupabaseClient } from "@supabase/supabase-js"

import { getSupabasePublicEnv } from "@/lib/supabase/env"
import type { Database } from "@/lib/supabase/database.types"

let supabaseClient: SupabaseClient<Database> | undefined

export function getSupabaseClient() {
  if (!supabaseClient) {
    const { url, publishableKey } = getSupabasePublicEnv()

    supabaseClient = createSupabaseClient<Database>(url, publishableKey, {
      auth: {
        autoRefreshToken: false,
        detectSessionInUrl: false,
        persistSession: false,
      },
    })
  }

  return supabaseClient
}
