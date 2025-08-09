// app/b/[slug]/page.tsx
import { createClient } from '@supabase/supabase-js';

// Tell Next this is a dynamic route that should be rendered per-request (recommended for DB reads)
export const dynamic = 'force-dynamic';

type PageProps = {
    params: { slug: string };
};

async function getBusiness(slug: string) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export default async function BusinessPublicPage({ params }: PageProps) {
    const business = await getBusiness(params.slug);

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-semibold">{business.name}</h1>
            <p className="text-gray-600">{business.address}</p>
            <div className="border rounded p-4">
                <p>Public page for: {business.slug}</p>
                <p>QR: {business.qr_url || '—'}</p>
                {/* TODO: Add Join Walk-in button + Realtime position */}
            </div>
        </div>
    );
}
