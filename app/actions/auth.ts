'use server'

import { createClient } from '@/lib/supabase'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

interface SignUpPayload {
  email: string
  password: string
  role: 'hr' | 'candidate'
}

interface SignInPayload {
  email: string
  password: string
}

export async function handleSignUp({ email, password, role }: SignUpPayload) {
  try {
    // 1. Inisialisasi Supabase Client
    const supabase = await createClient()

    // 2. Lakukan Sign Up via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) throw new Error(authError.message)
    if (!authData.user) throw new Error('User gagal dibuat')

    // 3. Simpan role ke tabel profiles
    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        role,
      })

    if (profileError) throw new Error(profileError.message)

    return { success: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan'
    return { success: false, error: message }
  }
}

export async function handleSignIn({ email, password }: SignInPayload) {
  try {
    // 1. Inisialisasi Supabase Client
    const supabase = await createClient()

    // 2. Lakukan Login
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    if (authError) throw new Error(authError.message)
    if (!authData.user) throw new Error('User tidak ditemukan')

    // 3. Ambil data profile untuk tahu role-nya
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single()

    if (profileError || !profile) {
      throw new Error('Data profil user tidak ditemukan')
    }

    // 4. Set cookie tambahan jika diperlukan
    const cookieStore = await cookies()
    cookieStore.set('user_id', authData.user.id, { httpOnly: true, path: '/' })
    cookieStore.set('user_role', profile.role, { httpOnly: true, path: '/' })

    return {
      success: true,
      role: profile.role as 'hr' | 'candidate',
      userId: authData.user.id,
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan'
    return { success: false, error: message }
  }
}

export async function handleSignOut() {
  const supabase = await createClient()
  
  // Sign out dari Supabase Auth
  await supabase.auth.signOut()

  // Hapus cookie manual
  const cookieStore = await cookies()
  cookieStore.delete('user_id')
  cookieStore.delete('user_role')

  redirect('/login')
}

export async function activateSubscription() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'Silakan login terlebih dahulu.' }
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ is_subscribed: true })
      .eq('id', user.id)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    return { success: true }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan'
    return { success: false, error: message }
  }
}