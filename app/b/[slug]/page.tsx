import { supabase } from '@/lib/supabaseClient';

type Props = { params: { slug: string } };

export default async function BusinessPublicPage({ params }: Props) {
    const { slug } = params;
    const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error) {
        return <div className="p-6">Business not found.</div>;
    }

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-semibold">{data.name}</h1>
            <p className="text-gray-600">{data.address}</p>
            <div className="border rounded p-4">
                <p>Public page placeholder for: {data.slug}</p>
                <p>QR (if stored): {data.qr_url || '—'}</p>
                {/* Next steps: Join Walk-in button + Realtime position */}
            </div>
        </div>
    );
}