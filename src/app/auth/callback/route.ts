import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.redirect("https://billings.skittex.in/");
}