'use client';

import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

type Business = {
    id: string;
    name: string;
    address?: string;
    phone?: string;
    qr_url?: string;
    slug: string;
};

type Props = {
    params: Promise<{ slug: string }>;
};

export default function PrintQR({ params }: Props) {
    const [business, setBusiness] = useState<Business | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [slug, setSlug] = useState<string>('');

    useEffect(() => {
        async function getSlug() {
            const resolvedParams = await params;
            setSlug(resolvedParams.slug);
        }
        getSlug();
    }, [params]);

    useEffect(() => {
        if (!slug) return;

        async function loadBusiness() {
            try {
                const supabase = createClient(
                    process.env.NEXT_PUBLIC_SUPABASE_URL!,
                    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
                );

                const { data, error } = await supabase
                    .from('businesses')
                    .select('*')
                    .eq('slug', slug);

                if (error) {
                    setError(`Database error: ${error.message}`);
                } else if (!data || data.length === 0) {
                    setError(`No business found with slug: ${slug}`);
                } else {
                    setBusiness(data[0]);
                }
            } catch (err: any) {
                setError(err.message || 'Unknown error occurred');
            } finally {
                setLoading(false);
            }
        }

        loadBusiness();
    }, [slug]);

    if (loading) {
        return (
            <div className="p-8">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-8">
                <div className="max-w-md mx-auto text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading QR Page</h1>
                    <div className="text-left bg-gray-100 p-4 rounded mb-4">
                        <p className="text-sm text-gray-700 mb-2"><strong>Error Details:</strong></p>
                        <p className="text-sm text-red-600">{error}</p>
                    </div>
                    <a
                        href="/admin"
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Back to Admin Dashboard
                    </a>
                </div>
            </div>
        );
    }

    if (!business) {
        return (
            <div className="p-8">
                <div className="text-center">Business not found</div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="print:hidden mb-4 space-x-2">
                <button
                    onClick={() => window.print()}
                    className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800"
                >
                    Print QR Code
                </button>
                <a
                    href={business.qr_url || '#'}
                    target="_blank"
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                    Download QR
                </a>
            </div>

            <div className="border-2 border-gray-300 p-8 rounded-lg max-w-md mx-auto text-center space-y-6 bg-white">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{business.name}</h1>
                    <p className="text-lg text-gray-600 mt-2">{business.address || 'No address'}</p>
                    {business.phone && (
                        <p className="text-md text-gray-500">{business.phone}</p>
                    )}
                </div>

                {business.qr_url ? (
                    <div className="space-y-4">
                        <img
                            src={business.qr_url}
                            alt="QR Code"
                            className="w-64 h-64 mx-auto border border-gray-200"
                        />
                        <div className="text-center">
                            <p className="text-xl font-semibold text-gray-800">Scan to Join Queue</p>
                            <p className="text-sm text-gray-500 mt-1">
                                Point your camera at this code to join our virtual queue
                            </p>
                        </div>
                    </div>
                ) : (
                    <p className="text-red-500">QR code not available</p>
                )}
            </div>
        </div>
    );
}
