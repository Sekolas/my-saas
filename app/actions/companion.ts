'use server'

import { auth } from "@clerk/nextjs/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { redirect } from "next/navigation"

export async function createCompanion(prevState: any, formData: FormData) {
    const { userId } = await auth()

    if (!userId) {
        return { message: "Unauthorized" }
    }

    const name = formData.get("name") as string
    const subject = formData.get("subject") as string
    const topic = formData.get("topic") as string
    const voice = formData.get("voice") as string
    const style = formData.get("style") as string
    const duration = parseInt(formData.get("duration") as string)

    if (!name || !subject || !topic || !voice || !style || !duration) {
        return { message: "Missing required fields" }
    }

    const supabase = createAdminClient()

    try {
        const { data, error } = await supabase
            .from("companions")
            .insert({
                author: userId,
                name,
                subject,
                topic,
                voice,
                style,
                duration,
            })
            .select()
            .single()

        if (error) {
            console.error("Supabase Error:", error)
            return { message: "Database Error: " + error.message }
        }

        return { success: true, companionId: data.id }
    } catch (err) {
        console.error("Server Action Error:", err)
        return { message: "Internal Server Error" }
    }
}
