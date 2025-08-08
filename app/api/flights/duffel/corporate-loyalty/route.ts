import { NextRequest, NextResponse } from "next/server";
import { createDuffelClient, handleDuffelError } from "@/lib/duffel";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

// Esquema para validar programas de fidelidad
const loyaltyProgramSchema = z.object({
  airline_iata_code: z.string().length(2, "El código IATA debe tener exactamente 2 caracteres"),
  account_number: z.string().min(5, "El número de cuenta debe tener al menos 5 caracteres"),
  account_holder_title: z.enum(["mr", "ms", "mrs", "miss", "dr"]).optional(),
  account_holder_first_name: z.string().optional(),
  account_holder_last_name: z.string().optional(),
});

// Esquema para validar códigos corporativos
const corporateCodeSchema = z.object({
  airline_iata_code: z.string().length(2, "El código IATA debe tener exactamente 2 caracteres"),
  code: z.string().min(3, "El código corporativo debe tener al menos 3 caracteres"),
  code_type: z.enum(["corporate_code", "tour_code", "discount_code"]).optional(),
  description: z.string().optional(),
});

/**
 * GET - Obtener programas de fidelidad y códigos corporativos del usuario
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Obtener programas de fidelidad del usuario
    const { data: loyaltyPrograms, error: loyaltyError } = await supabase
      .from("user_loyalty_programs")
      .select("*")
      .eq("user_id", user.id);

    if (loyaltyError) {
      console.error("Error fetching loyalty programs:", loyaltyError);
      return NextResponse.json({ 
        success: false, 
        error: "Error fetching loyalty programs" 
      }, { status: 500 });
    }

    // Obtener códigos corporativos del usuario
    const { data: corporateCodes, error: corporateError } = await supabase
      .from("user_corporate_codes")
      .select("*")
      .eq("user_id", user.id);

    if (corporateError) {
      console.error("Error fetching corporate codes:", corporateError);
      return NextResponse.json({ 
        success: false, 
        error: "Error fetching corporate codes" 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      data: {
        loyalty_programs: loyaltyPrograms || [],
        corporate_codes: corporateCodes || []
      }
    });

  } catch (error) {
    console.error("Loyalty programs API error:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 });
  }
}

/**
 * POST - Añadir un programa de fidelidad
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Validar tipo de petición
    const body = await request.json();
    const requestType = body.type || "loyalty_program";

    // Manejar adición de programa de fidelidad
    if (requestType === "loyalty_program") {
      const loyaltyData = loyaltyProgramSchema.parse(body);

      // Verificar si ya existe
      const { data: existingProgram } = await supabase
        .from("user_loyalty_programs")
        .select("*")
        .eq("user_id", user.id)
        .eq("airline_iata_code", loyaltyData.airline_iata_code)
        .single();

      if (existingProgram) {
        // Actualizar en lugar de crear
        const { data, error } = await supabase
          .from("user_loyalty_programs")
          .update({
            account_number: loyaltyData.account_number,
            account_holder_title: loyaltyData.account_holder_title,
            account_holder_first_name: loyaltyData.account_holder_first_name,
            account_holder_last_name: loyaltyData.account_holder_last_name,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingProgram.id)
          .select()
          .single();

        if (error) {
          console.error("Error updating loyalty program:", error);
          return NextResponse.json({ 
            success: false, 
            error: "Error updating loyalty program" 
          }, { status: 500 });
        }

        return NextResponse.json({
          success: true,
          message: "Loyalty program updated successfully",
          data
        });
      }

      // Crear nuevo programa