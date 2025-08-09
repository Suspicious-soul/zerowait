import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function toSlugBase(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

function shortId() {
    return Math.random().toString(36).slice(2, 6);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, address, phone } = body;

        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const slug = `${toSlugBase(name)}-${shortId()}`;
        const publicUrl = `https://zerowait-kappa.vercel.app/b/${slug}`;
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(publicUrl)}`;

        const { data, error } = await supabase
            .from('businesses')
            .insert([{ name, address, phone, slug, qr_url: qrUrl, public_page: true }])
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ business: data }, { status: 200 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message || 'Unknown error' }, { status: 500 });
    }
}
