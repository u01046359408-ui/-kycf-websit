import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/admin/auth";

// GET: Admin only - list all page contents
export async function GET() {
  try {
    const { error: authError, supabase } = await verifyAdmin();
    if (authError) return authError;

    const { data, error } = await supabase!
      .from("page_contents")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      return NextResponse.json(
        { error: "Failed to fetch page contents" },
        { status: 500 }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
