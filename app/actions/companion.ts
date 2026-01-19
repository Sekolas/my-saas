'use server'

import { auth } from "@clerk/nextjs/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { companionSchema, formatValidationErrors } from "@/lib/validation"

interface ActionResult {
    success: boolean
    companionId?: string
    message?: string
    errors?: Record<string, string>
}

/**
 * Create a new companion
 * Server action for companion creation with validation
 */
export async function createCompanion(prevState: any, formData: FormData): Promise<ActionResult> {
    try {
        // Check authentication
        const { userId } = await auth()

        if (!userId) {
            return {
                success: false,
                message: "Unauthorized. Please sign in to create a companion."
            }
        }

        // Extract and parse form data
        const rawData = {
            name: formData.get("name") as string,
            subject: formData.get("subject") as string,
            topic: formData.get("topic") as string,
            voice: formData.get("voice") as string,
            style: formData.get("style") as string,
            duration: parseInt(formData.get("duration") as string, 10),
        }

        // Validate with Zod schema
        const validationResult = companionSchema.safeParse(rawData)

        if (!validationResult.success) {
            return {
                success: false,
                message: "Validation failed. Please check your input.",
                errors: formatValidationErrors(validationResult.error),
            }
        }

        const validatedData = validationResult.data

        // Create companion in database
        const supabase = createAdminClient()

        const { data, error } = await supabase
            .from("companions")
            .insert({
                author: userId,
                name: validatedData.name,
                subject: validatedData.subject,
                topic: validatedData.topic,
                voice: validatedData.voice,
                style: validatedData.style,
                duration: validatedData.duration,
            })
            .select()
            .single()

        if (error) {
            console.error("[createCompanion] Database error:", error)

            // Handle specific database errors
            if (error.code === '23505') {
                return {
                    success: false,
                    message: "A companion with this name already exists."
                }
            }

            return {
                success: false,
                message: `Database error: ${error.message}`
            }
        }

        if (!data) {
            return {
                success: false,
                message: "Failed to create companion. No data returned."
            }
        }

        return {
            success: true,
            companionId: data.id,
            message: "Companion created successfully!"
        }
    } catch (err) {
        console.error("[createCompanion] Unexpected error:", err)

        return {
            success: false,
            message: err instanceof Error ? err.message : "An unexpected error occurred"
        }
    }
}
