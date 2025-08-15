export const runtime = "nodejs"

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
 * POST - Añadir un programa de fidelidad o código corporativo
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
      const { data, error } = await supabase
        .from("user_loyalty_programs")
        .insert({
          user_id: user.id,
          airline_iata_code: loyaltyData.airline_iata_code,
          account_number: loyaltyData.account_number,
          account_holder_title: loyaltyData.account_holder_title,
          account_holder_first_name: loyaltyData.account_holder_first_name,
          account_holder_last_name: loyaltyData.account_holder_last_name,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating loyalty program:", error);
        return NextResponse.json({ 
          success: false, 
          error: "Error creating loyalty program" 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "Loyalty program added successfully",
        data
      });
    }
    
    // Manejar adición de código corporativo
    if (requestType === "corporate_code") {
      const corporateData = corporateCodeSchema.parse(body);

      // Verificar si ya existe
      const { data: existingCode } = await supabase
        .from("user_corporate_codes")
        .select("*")
        .eq("user_id", user.id)
        .eq("airline_iata_code", corporateData.airline_iata_code)
        .eq("code", corporateData.code)
        .single();

      if (existingCode) {
        // Actualizar en lugar de crear
        const { data, error } = await supabase
          .from("user_corporate_codes")
          .update({
            code_type: corporateData.code_type,
            description: corporateData.description,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingCode.id)
          .select()
          .single();

        if (error) {
          console.error("Error updating corporate code:", error);
          return NextResponse.json({ 
            success: false, 
            error: "Error updating corporate code" 
          }, { status: 500 });
        }

        return NextResponse.json({
          success: true,
          message: "Corporate code updated successfully",
          data
        });
      }

      // Crear nuevo código corporativo
      const { data, error } = await supabase
        .from("user_corporate_codes")
        .insert({
          user_id: user.id,
          airline_iata_code: corporateData.airline_iata_code,
          code: corporateData.code,
          code_type: corporateData.code_type || "corporate_code",
          description: corporateData.description,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating corporate code:", error);
        return NextResponse.json({ 
          success: false, 
          error: "Error creating corporate code" 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "Corporate code added successfully",
        data
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: "Invalid request type" 
    }, { status: 400 });

  } catch (error) {
    console.error("Loyalty program API error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid input data", details: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 });
  }
}

/**
 * DELETE - Eliminar un programa de fidelidad o código corporativo
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!type || !id) {
      return NextResponse.json({
        success: false,
        error: "Missing type or id parameter"
      }, { status: 400 });
    }

    let result;
    
    if (type === 'loyalty_program') {
      // Verificar que el programa pertenece al usuario
      const { data: program } = await supabase
        .from("user_loyalty_programs")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (!program) {
        return NextResponse.json({
          success: false,
          error: "Loyalty program not found or access denied"
        }, { status: 404 });
      }

      // Eliminar el programa
      result = await supabase
        .from("user_loyalty_programs")
        .delete()
        .eq("id", id);
    } else if (type === 'corporate_code') {
      // Verificar que el código pertenece al usuario
      const { data: code } = await supabase
        .from("user_corporate_codes")
        .select("*")
        .eq("id", id)
        .eq("user_id", user.id)
        .single();

      if (!code) {
        return NextResponse.json({
          success: false,
          error: "Corporate code not found or access denied"
        }, { status: 404 });
      }

      // Eliminar el código
      result = await supabase
        .from("user_corporate_codes")
        .delete()
        .eq("id", id);
    } else {
      return NextResponse.json({
        success: false,
        error: "Invalid type parameter (must be 'loyalty_program' or 'corporate_code')"
      }, { status: 400 });
    }

    if ((result as any).error) {
      console.error(`Error deleting ${type}:`, (result as any).error);
      return NextResponse.json({ 
        success: false, 
        error: `Error deleting ${type}` 
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: `${type === 'loyalty_program' ? 'Loyalty program' : 'Corporate code'} deleted successfully`
    });

  } catch (error) {
    console.error("Delete loyalty/corporate API error:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 });
  }
}
