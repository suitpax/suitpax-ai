import { NextRequest, NextResponse } from "next/server";
import { createDuffelClient, handleDuffelError } from "@/lib/duffel-client";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

// Esquema para validar programas de fidelidad corporativos
const corporateLoyaltySchema = z.object({
  airline_iata_code: z.string().length(2, "El código IATA debe tener exactamente 2 caracteres"),
  account_number: z.string().min(5, "El número de cuenta debe tener al menos 5 caracteres"),
  company_name: z.string().min(2, "El nombre de la empresa debe tener al menos 2 caracteres"),
  organization_id: z.string().optional(),
  expiry_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)").optional(),
  admin_email: z.string().email("Email inválido").optional(),
  admin_phone: z.string().optional(),
  description: z.string().optional(),
});

// Esquema para autorización de uso de programa corporativo
const corporateLoyaltyAuthSchema = z.object({
  corporate_loyalty_id: z.string(),
  user_id: z.string().optional(),
  email: z.string().email("Email inválido").optional(),
  role: z.enum(["admin", "user", "guest"]).default("user"),
  expires_at: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)").optional(),
  allowed_routes: z.array(
    z.object({
      origin: z.string().length(3, "Código IATA inválido"),
      destination: z.string().length(3, "Código IATA inválido")
    })
  ).optional(),
  max_bookings: z.number().int().positive().optional(),
});

/**
 * GET - Obtener programas de fidelidad corporativos disponibles para el usuario
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Obtener programas de fidelidad corporativos que administra el usuario
    const { data: adminPrograms, error: adminError } = await supabase
      .from("corporate_loyalty_programs")
      .select("*")
      .eq("admin_id", user.id);

    if (adminError) {
      console.error("Error fetching admin loyalty programs:", adminError);
      return NextResponse.json({ 
        success: false, 
        error: "Error fetching admin loyalty programs" 
      }, { status: 500 });
    }

    // Obtener programas de fidelidad corporativos a los que tiene acceso el usuario
    const { data: userAuthorizations, error: authError } = await supabase
      .from("corporate_loyalty_authorizations")
      .select("*, corporate_loyalty_programs(*)")
      .eq("user_id", user.id)
      .eq("active", true);

    if (authError) {
      console.error("Error fetching user loyalty authorizations:", authError);
      return NextResponse.json({ 
        success: false, 
        error: "Error fetching user loyalty authorizations" 
      }, { status: 500 });
    }

    // Organizar los programas para la respuesta
    const corporatePrograms = {
      administered: adminPrograms || [],
      authorized: userAuthorizations?.map(auth => ({
        authorization_id: auth.id,
        role: auth.role,
        expires_at: auth.expires_at,
        allowed_routes: auth.allowed_routes,
        max_bookings: auth.max_bookings,
        remaining_bookings: auth.remaining_bookings,
        program: auth.corporate_loyalty_programs
      })) || []
    };

    return NextResponse.json({
      success: true,
      data: corporatePrograms
    });

  } catch (error) {
    console.error("Corporate loyalty programs API error:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 });
  }
}

/**
 * POST - Crear nuevo programa de fidelidad corporativo o autorizar a un usuario
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Verificar tipo de petición
    const body = await request.json();
    const requestType = body.type || "create";

    // Manejar creación de programa de fidelidad corporativo
    if (requestType === "create") {
      // Verificar permisos (solo usuarios con rol "business" o "admin" pueden crear programas corporativos)
      const { data: userProfile } = await supabase
        .from("user_profiles")
        .select("role")
        .eq("user_id", user.id)
        .single();
      
      if (!userProfile || (userProfile.role !== "business" && userProfile.role !== "admin")) {
        return NextResponse.json({ 
          success: false, 
          error: "You don't have permission to create corporate loyalty programs" 
        }, { status: 403 });
      }

      const loyaltyData = corporateLoyaltySchema.parse(body);

      // Verificar si ya existe un programa similar
      const { data: existingProgram } = await supabase
        .from("corporate_loyalty_programs")
        .select("*")
        .eq("airline_iata_code", loyaltyData.airline_iata_code)
        .eq("account_number", loyaltyData.account_number)
        .single();

      if (existingProgram) {
        return NextResponse.json({ 
          success: false, 
          error: "A corporate loyalty program with this airline and account number already exists" 
        }, { status: 409 });
      }

      // Crear nuevo programa corporativo
      const { data, error } = await supabase
        .from("corporate_loyalty_programs")
        .insert({
          admin_id: user.id,
          airline_iata_code: loyaltyData.airline_iata_code,
          account_number: loyaltyData.account_number,
          company_name: loyaltyData.company_name,
          organization_id: loyaltyData.organization_id,
          expiry_date: loyaltyData.expiry_date,
          admin_email: loyaltyData.admin_email || user.email,
          admin_phone: loyaltyData.admin_phone,
          description: loyaltyData.description,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating corporate loyalty program:", error);
        return NextResponse.json({ 
          success: false, 
          error: "Error creating corporate loyalty program" 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "Corporate loyalty program created successfully",
        data
      });
    }
    
    // Manejar autorización de usuario para usar un programa corporativo
    if (requestType === "authorize") {
      const authData = corporateLoyaltyAuthSchema.parse(body);

      // Verificar que el programa existe y el usuario actual es el administrador
      const { data: program } = await supabase
        .from("corporate_loyalty_programs")
        .select("*")
        .eq("id", authData.corporate_loyalty_id)
        .eq("admin_id", user.id)
        .single();

      if (!program) {
        return NextResponse.json({ 
          success: false, 
          error: "Corporate loyalty program not found or you are not the administrator" 
        }, { status: 404 });
      }

      // Si no se especifica un usuario, se usa el email
      let targetUserId = authData.user_id;

      if (!targetUserId && authData.email) {
        // Buscar usuario por email
        const { data: foundUser } = await supabase
          .from("users")
          .select("id")
          .eq("email", authData.email)
          .single();

        if (foundUser) {
          targetUserId = foundUser.id;
        } else {
          // Crear una autorización pendiente por email
          const { data, error } = await supabase
            .from("corporate_loyalty_pending_authorizations")
            .insert({
              corporate_loyalty_id: authData.corporate_loyalty_id,
              email: authData.email,
              role: authData.role,
              expires_at: authData.expires_at,
              allowed_routes: authData.allowed_routes,
              max_bookings: authData.max_bookings,
              created_by: user.id,
              created_at: new Date().toISOString()
            })
            .select()
            .single();

          if (error) {
            console.error("Error creating pending authorization:", error);
            return NextResponse.json({ 
              success: false, 
              error: "Error creating pending authorization" 
            }, { status: 500 });
          }

          return NextResponse.json({
            success: true,
            message: "Pending authorization created for email",
            data: {
              pending: true,
              email: authData.email,
              id: data.id
            }
          });
        }
      }

      if (!targetUserId) {
        return NextResponse.json({ 
          success: false, 
          error: "Either user_id or email must be provided" 
        }, { status: 400 });
      }

      // Verificar si ya existe una autorización para este usuario y programa
      const { data: existingAuth } = await supabase
        .from("corporate_loyalty_authorizations")
        .select("*")
        .eq("corporate_loyalty_id", authData.corporate_loyalty_id)
        .eq("user_id", targetUserId)
        .single();

      if (existingAuth) {
        // Actualizar autorización existente
        const { data, error } = await supabase
          .from("corporate_loyalty_authorizations")
          .update({
            role: authData.role,
            expires_at: authData.expires_at,
            allowed_routes: authData.allowed_routes,
            max_bookings: authData.max_bookings,
            active: true,
            updated_at: new Date().toISOString()
          })
          .eq("id", existingAuth.id)
          .select()
          .single();

        if (error) {
          console.error("Error updating authorization:", error);
          return NextResponse.json({ 
            success: false, 
            error: "Error updating authorization" 
          }, { status: 500 });
        }

        return NextResponse.json({
          success: true,
          message: "Authorization updated successfully",
          data
        });
      }

      // Crear nueva autorización
      const { data, error } = await supabase
        .from("corporate_loyalty_authorizations")
        .insert({
          corporate_loyalty_id: authData.corporate_loyalty_id,
          user_id: targetUserId,
          role: authData.role,
          expires_at: authData.expires_at,
          allowed_routes: authData.allowed_routes,
          max_bookings: authData.max_bookings,
          remaining_bookings: authData.max_bookings,
          active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating authorization:", error);
        return NextResponse.json({ 
          success: false, 
          error: "Error creating authorization" 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "Authorization created successfully",
        data
      });
    }

    return NextResponse.json({ 
      success: false, 
      error: "Invalid request type" 
    }, { status: 400 });

  } catch (error) {
    console.error("Corporate loyalty program API error:", error);
    
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
 * DELETE - Eliminar o desactivar un programa de fidelidad corporativo o autorización
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

    // Eliminar programa corporativo
    if (type === 'program') {
      // Verificar que el programa pertenece al usuario
      const { data: program } = await supabase
        .from("corporate_loyalty_programs")
        .select("*")
        .eq("id", id)
        .eq("admin_id", user.id)
        .single();

      if (!program) {
        return NextResponse.json({
          success: false,
          error: "Corporate loyalty program not found or you are not the administrator"
        }, { status: 404 });
      }

      // Eliminar todas las autorizaciones asociadas
      await supabase
        .from("corporate_loyalty_authorizations")
        .delete()
        .eq("corporate_loyalty_id", id);

      // Eliminar el programa
      const result = await supabase
        .from("corporate_loyalty_programs")
        .delete()
        .eq("id", id);

      if (result.error) {
        console.error("Error deleting corporate loyalty program:", result.error);
        return NextResponse.json({ 
          success: false, 
          error: "Error deleting corporate loyalty program" 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "Corporate loyalty program deleted successfully"
      });
    } 
    
    // Eliminar autorización
    if (type === 'authorization') {
      // Verificar que el usuario es el administrador del programa asociado
      const { data: auth } = await supabase
        .from("corporate_loyalty_authorizations")
        .select("*, corporate_loyalty_programs!inner(*)")
        .eq("id", id)
        .single();

      if (!auth) {
        return NextResponse.json({
          success: false,
          error: "Authorization not found"
        }, { status: 404 });
      }

      // Comprobar si el usuario es el administrador del programa o el propio usuario autorizado
      if (auth.corporate_loyalty_programs.admin_id !== user.id && auth.user_id !== user.id) {
        return NextResponse.json({
          success: false,
          error: "You don't have permission to remove this authorization"
        }, { status: 403 });
      }

      // Eliminar la autorización
      const result = await supabase
        .from("corporate_loyalty_authorizations")
        .delete()
        .eq("id", id);

      if (result.error) {
        console.error("Error deleting authorization:", result.error);
        return NextResponse.json({ 
          success: false, 
          error: "Error deleting authorization" 
        }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "Authorization deleted successfully"
      });
    }

    return NextResponse.json({
      success: false,
      error: "Invalid type parameter (must be 'program' or 'authorization')"
    }, { status: 400 });

  } catch (error) {
    console.error("Delete corporate loyalty API error:", error);
    return NextResponse.json({
      success: false,
      error: "Internal server error"
    }, { status: 500 });
  }
}