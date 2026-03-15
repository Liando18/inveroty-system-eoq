import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { sendEmail } from "@/app/lib/email";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email wajib diisi." },
        { status: 400 },
      );
    }

    const { data: user, error } = await supabaseAdmin
      .from("user")
      .select("id, nama, email")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    if (error) {
      console.error("DB error:", error);
      return NextResponse.json(
        { message: "Terjadi kesalahan." },
        { status: 500 },
      );
    }

    if (!user) {
      return NextResponse.json(
        { message: "Email tidak ditemukan." },
        { status: 404 },
      );
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 1000 * 60 * 60);

    const { error: updateError } = await supabaseAdmin
      .from("user")
      .update({
        reset_token: token,
        reset_token_expires: expires.toISOString(),
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Update error:", updateError);
      return NextResponse.json(
        { message: "Terjadi kesalahan." },
        { status: 500 },
      );
    }

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/login/reset-password?token=${token}`;

    await sendEmail({
      to: user.email,
      subject: "Reset Password - 4Yos Veterinary Care Care",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto;">
          <div style="background: #16a34a; padding: 24px; border-radius: 12px 12px 0 0;">
            <h2 style="color: white; margin: 0; font-size: 18px;">🐾 4Yos Veterinary Care Care</h2>
          </div>
          <div style="background: #f9fafb; padding: 28px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
            <p style="color: #111827; font-size: 15px; margin-top: 0;">Halo, <strong>${user.nama}</strong></p>
            <p style="color: #6b7280; font-size: 14px;">Kami menerima permintaan reset password untuk akun Anda. Klik tombol di bawah untuk melanjutkan:</p>
            <div style="text-align: center; margin: 28px 0;">
              <a href="${resetUrl}"
                style="background: #16a34a; color: white; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="color: #9ca3af; font-size: 12px;">Link ini berlaku selama <strong>1 jam</strong>. Jika Anda tidak meminta reset password, abaikan email ini.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
            <p style="color: #9ca3af; font-size: 11px; margin: 0;">© 2025 4Yos Veterinary Care Care · Sistem Manajemen Persediaan</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json(
      { message: "Email berhasil dikirim." },
      { status: 200 },
    );
  } catch (err) {
    console.error("Send reset email error:", err);
    return NextResponse.json(
      { message: "Terjadi kesalahan server." },
      { status: 500 },
    );
  }
}
