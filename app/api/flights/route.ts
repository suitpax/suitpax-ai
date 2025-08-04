import { NextRequest, NextResponse } from "next/server";
import { searchDuffel } from "./duffel/route";
// Cuando agregues otro proveedor, importa su función aquí
// import { searchExpedia } from "./expedia/route";

export async function POST(req: NextRequest) {
  const params = await req.json();

  // Ejecuta la búsqueda en todos los proveedores en paralelo
  const [resultsDuffel /*, resultsExpedia*/] = await Promise.all([
    searchDuffel(params),
    // searchExpedia(params),
  ]);

  // Combina los resultados
  const allResults = [
    ...(resultsDuffel || []),
    // ...(resultsExpedia || []),
  ];

  // Si quieres, aquí puedes deduplicar/ordenar/filtrar

  return NextResponse.json(allResults);
}
