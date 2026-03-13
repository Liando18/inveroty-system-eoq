import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        { message: "Data tidak lengkap." },
        { status: 400 },
      );
    }

    const { data: user, error } = await supabaseAdmin
      .from("user")
      .select("id, reset_token_expires")
      .eq("reset_token", token)
      .maybeSingle();

    if (error || !user) {
      return NextResponse.json(
        { message: "Token tidak valid." },
        { status: 400 },
      );
    }

    const expires = new Date(user.reset_token_expires);
    if (expires < new Date()) {
      return NextResponse.json(
        { message: "Token sudah kadaluarsa." },
        { status: 400 },
      );
    }

    const { error: updateError } = await supabaseAdmin
      .from("user")
      .update({
        password,
        reset_token: null,
        reset_token_expires: null,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json(
        { message: "Terjadi kesalahan." },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { message: "Password berhasil diubah." },
      { status: 200 },
    );
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json(
      { message: "Terjadi kesalahan server." },
      { status: 500 },
    );
  }
}
