"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export type User = {
  id: string
  login: string
  coins: number
  prefix: string | null
  is_admin: boolean
  played_hours: number
  kills: number
  deaths: number
  wins: number
  two_factor_enabled: boolean
  telegram_linked: boolean
  discord_linked: boolean
  created_at: string
}

export async function registerUser(
  login: string,
  password: string,
): Promise<{ success: boolean; error?: string; user?: User }> {
  const supabase = await createClient()

  // Check if user already exists
  const { data: existingUser } = await supabase.from("users").select("id").eq("login", login.toLowerCase()).single()

  if (existingUser) {
    return { success: false, error: "Пользователь с таким логином уже существует" }
  }

  // Create new user
  const { data, error } = await supabase
    .from("users")
    .insert({
      login: login.toLowerCase(),
      password: password,
    })
    .select()
    .single()

  if (error) {
    return { success: false, error: "Ошибка при создании пользователя" }
  }

  // Set session cookie
  const cookieStore = await cookies()
  cookieStore.set("neverland_user", data.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })

  return { success: true, user: data }
}

export async function loginUser(
  login: string,
  password: string,
): Promise<{ success: boolean; error?: string; user?: User }> {
  const supabase = await createClient()

  const { data, error } = await supabase.from("users").select("*").eq("login", login.toLowerCase()).single()

  if (error || !data) {
    return { success: false, error: "Пользователь не найден" }
  }

  if (data.password !== password) {
    return { success: false, error: "Неверный пароль" }
  }

  // Set session cookie
  const cookieStore = await cookies()
  cookieStore.set("neverland_user", data.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  })

  return { success: true, user: data }
}

export async function logoutUser(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("neverland_user")
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const userId = cookieStore.get("neverland_user")?.value

  if (!userId) return null

  const supabase = await createClient()
  const { data } = await supabase.from("users").select("*").eq("id", userId).single()

  return data || null
}

export async function getAllUsers(): Promise<User[]> {
  const supabase = await createClient()
  const { data } = await supabase.from("users").select("*").order("created_at", { ascending: false })

  return data || []
}

export async function giveCoins(targetLogin: string, amount: number): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  // Find user
  const { data: user } = await supabase
    .from("users")
    .select("id, coins")
    .eq("login", targetLogin.toLowerCase())
    .single()

  if (!user) {
    return { success: false, error: "Игрок не найден" }
  }

  // Update coins
  const { error } = await supabase
    .from("users")
    .update({ coins: user.coins + amount })
    .eq("id", user.id)

  if (error) {
    return { success: false, error: "Ошибка при выдаче монет" }
  }

  return { success: true }
}

export async function setAdmin(targetLogin: string, isAdmin: boolean): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { data: user } = await supabase.from("users").select("id").eq("login", targetLogin.toLowerCase()).single()

  if (!user) {
    return { success: false, error: "Игрок не найден" }
  }

  const { error } = await supabase.from("users").update({ is_admin: isAdmin }).eq("id", user.id)

  if (error) {
    return { success: false, error: "Ошибка при изменении прав" }
  }

  return { success: true }
}

export async function setPrefix(
  targetLogin: string,
  prefix: string | null,
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { data: user } = await supabase.from("users").select("id").eq("login", targetLogin.toLowerCase()).single()

  if (!user) {
    return { success: false, error: "Игрок не найден" }
  }

  const { error } = await supabase.from("users").update({ prefix: prefix }).eq("id", user.id)

  if (error) {
    return { success: false, error: "Ошибка при установке префикса" }
  }

  return { success: true }
}

export async function updateUserSettings(
  userId: string,
  settings: {
    two_factor_enabled?: boolean
    telegram_linked?: boolean
    discord_linked?: boolean
  },
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const { error } = await supabase.from("users").update(settings).eq("id", userId)

  if (error) {
    return { success: false, error: "Ошибка при обновлении настроек" }
  }

  return { success: true }
}
