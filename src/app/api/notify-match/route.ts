import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Karşı tarafa işbirliği/eşleşme bildirimi e-postası gönderir.
// Gerekli env değişkenleri (Vercel'e eklenmeli):
//   SUPABASE_SERVICE_ROLE_KEY  — alıcı e-postasını güvenli okumak için
//   RESEND_API_KEY             — e-posta göndermek için
//   NEXT_PUBLIC_SUPABASE_URL   — mevcut
//   NOTIFY_FROM_EMAIL          — opsiyonel, doğrulanmış Resend gönderen adresi

const FROM = process.env.NOTIFY_FROM_EMAIL || 'Here2Next <bildirim@here2next.org>';
const SITE = 'https://here2next.org';

export async function POST(req: NextRequest) {
  try {
    const { requestId, notify, event } = await req.json();

    if (!requestId || !['startup', 'corporate'].includes(notify)) {
      return NextResponse.json({ error: 'invalid payload' }, { status: 400 });
    }

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const resendKey = process.env.RESEND_API_KEY;
    if (!serviceKey || !resendKey) {
      // Ayar eksikse sessizce geç — akışı bozma
      return NextResponse.json({ ok: false, reason: 'not configured' });
    }

    const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey);

    // İlgili talebi + iki tarafın adlarını ve profil id'lerini çek
    const { data: reqRow } = await admin
      .from('match_requests')
      .select('id, startup_id, corporate_id, startups(name, slug, profile_id), corporates(name, slug, profile_id)')
      .eq('id', requestId)
      .single();

    if (!reqRow) return NextResponse.json({ error: 'request not found' }, { status: 404 });

    const startup: any = Array.isArray(reqRow.startups) ? reqRow.startups[0] : reqRow.startups;
    const corporate: any = Array.isArray(reqRow.corporates) ? reqRow.corporates[0] : reqRow.corporates;

    const recipientProfileId = notify === 'startup' ? startup?.profile_id : corporate?.profile_id;
    if (!recipientProfileId) return NextResponse.json({ ok: false, reason: 'recipient not linked' });

    // Alıcının e-postası
    const { data: recipient } = await admin
      .from('profiles')
      .select('email, full_name')
      .eq('id', recipientProfileId)
      .single();

    if (!recipient?.email) return NextResponse.json({ ok: false, reason: 'no email' });

    const otherName = notify === 'startup' ? corporate?.name : startup?.name;
    const myName = notify === 'startup' ? startup?.name : corporate?.name;

    let subject = '';
    let heading = '';
    let body = '';
    if (event === 'accepted') {
      subject = `${otherName} işbirliği talebinizi onayladı`;
      heading = 'İşbirliği Onaylandı ✅';
      body = `<strong>${otherName}</strong>, <strong>${myName}</strong> ile işbirliği talebinizi onayladı. Detaylar için panelinize göz atın.`;
    } else if (event === 'rejected') {
      subject = `${otherName} işbirliği talebinizi yanıtladı`;
      heading = 'İşbirliği Talebi Yanıtlandı';
      body = `<strong>${otherName}</strong>, işbirliği talebinizi şu an için değerlendirmedi. Panelinizden diğer eşleşmeleri inceleyebilirsiniz.`;
    } else {
      // created — karşı tarafa validasyon çağrısı
      subject = `${otherName} sizinle işbirliği beyan etti — onayınız bekleniyor`;
      heading = 'Yeni İşbirliği Talebi 🤝';
      body = `<strong>${otherName}</strong>, <strong>${myName}</strong> ile bir işbirliği beyan etti. Talebi onaylamak veya reddetmek için panelinize gidin.`;
    }

    const html = `
      <div style="font-family:Poppins,Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;color:#1a1a2e">
        <h2 style="color:#183690;margin:0 0 16px">${heading}</h2>
        <p style="font-size:15px;line-height:1.6;margin:0 0 20px">${body}</p>
        <a href="${SITE}/dashboard" style="display:inline-block;background:#183690;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-weight:600">Panele Git</a>
        <p style="font-size:12px;color:#888;margin-top:28px">Here2Next — Startup ve Kurumları Bir Araya Getiriyoruz</p>
      </div>`;

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM, to: recipient.email, subject, html }),
    });

    if (!res.ok) {
      const errText = await res.text();
      return NextResponse.json({ ok: false, reason: 'resend error', detail: errText }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'server error' }, { status: 500 });
  }
}
