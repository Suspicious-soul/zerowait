'use client';

import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

export default function ClientBusinessView({ slug }: { slug: string }) {
    const [business, setBusiness] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let canceled = false;
        (async () => {
            const { data, error } = await supabase
                .from('businesses')
                .select('*')
                .eq('slug', slug)
                .single();
            if (!canceled) {
                if (error) setError(error.message);
                else setBusiness(data);
            }
        })();
        return () => { canceled = true; };
    }, [slug]);

    if (error) return <div className="p-6">Business not found.</div>;
    if (!business) return <div className="p-6">Loading…</div>;

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-semibold">{business.name}</h1>
            <p className="text-gray-600">{business.address}</p>
            <div className="border rounded p-4">
                <p>Public page for: {business.slug}</p>
                <p>QR: {business.qr_url || '—'}</p>
            </div>
        </div>
    );
}

Make the page a simple shell that passes params.slug:

app / b / [slug] / page.tsx

import ClientBusinessView from './ClientView';

export default function Page({ params }: { params: { slug: string } }) {
    return <ClientBusinessView slug={params.slug} />;
}