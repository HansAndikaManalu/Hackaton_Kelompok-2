'use server'

import { supabaseAdmin } from '@/lib/supabase'
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
    const { data: authData, error: authError } = await supabaseAdmin.auth.signUp({
      email,
      password,
    })

    if (authError) throw new Error(authError.message)
    if (!authData.user) throw new Error('User gagal dibuat')

    // Simpan role ke tabel profiles
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert({
        id: authData.user.id,
        email,
        role,
      })

    if (profileError) throw new Error(profileError.message)

    return { success: true }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function handleSignIn({ email, password }: SignInPayload) {
  try {
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.signInWithPassword({
        email,
        password,
      })

    if (authError) throw new Error(authError.message)
    if (!authData.user) throw new Error('User tidak ditemukan')

    // Ambil data profile
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', authData.user.id)
      .single()

    if (profileError || !profile) {
      throw new Error('Data profil user tidak ditemukan')
    }

    // Set cookie sederhana untuk menyimpan role/session di browser
    const cookieStore = await cookies()
    cookieStore.set('user_id', authData.user.id, { httpOnly: true, path: '/' })
    cookieStore.set('user_role', profile.role, { httpOnly: true, path: '/' })

    return {
      success: true,
      role: profile.role as 'hr' | 'candidate',
      userId: authData.user.id,
    }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function handleSignOut() {
  const cookieStore = await cookies()
  cookieStore.delete('user_id')
  cookieStore.delete('user_role')
  
  redirect('/login')
}