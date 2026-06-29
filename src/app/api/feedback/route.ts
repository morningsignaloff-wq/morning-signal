import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isLocalMode } from "@/lib/mode";

export async function POST(request: Request) {
  const body = (await request.json()) as { message?: string; email?: string };

  const message = body.message?.trim();
  if (!message || message.length < 10) {
    return NextResponse.json(
      { error: "Veuillez écrire un message d'au moins 10 caractères." },
      { status: 400 }
    );
  }

  const email = body.email?.trim() || null;

  if (isLocalMode()) {
    console.info("[feedback]", { email, message });
    return NextResponse.json({ ok: true });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const admin = createAdminClient();
  const { error } = await admin.from("feedback").insert({
    user_id: user?.id ?? null,
    email: email ?? user?.email ?? null,
    message,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
