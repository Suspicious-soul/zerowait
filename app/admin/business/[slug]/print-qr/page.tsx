import { createClient } from '@supabase/supabase-js';

type Props = { params: Promise<{ slug: string }> };

export const dynamic = 'force-dynamic';

async function getBusiness(slug: string) {
    try {
        console.log('Attempting to connect to Supabase...');

        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        console.log('Querying business with slug:', slug);

        // First, let's check what businesses exist
        const { data: allBusinesses, error: listError } = await supabase
            .from('businesses')
            .select('slug, name')
            .limit(10);

        console.log('All businesses in database:', allBusinesses);

        // Now query for the specific slug, but handle multiple results
        const { data, error, count } = await supabase
            .from('businesses')
            .select('*')
            .eq('slug', slug);

        if (error) {
            console.error('Supabase query error:', error);
            throw new Error(`Database error: ${error.message}`);
        }

        console.log('Query results count:', data?.length || 0);
        console.log('Query results:', data);

        if (!data || data.length === 0) {
            throw new Error(`No business found with slug: ${slug}. Available slugs: ${allBusinesses?.map(b => b.slug).join(', ')}`);
        }

        if (data.length > 1) {
            console.warn('Multiple businesses found with same slug:', data);
            // Take the first one, but warn about duplicates
        }

        const business = data[0]; // Take the first result
        console.log('Business selected:', business.name);
        return business;

    } catch (error) {
        console.error('getBusiness error:', error);
        throw error;
    }
}

export default async function PrintQR({ params }: Props) {
    try {
        console.log('PrintQR page loading...');

        const { slug } = await params;
        console.log('Received slug parameter:', slug);

        const business = await getBusiness(slug);

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
    } catch (error: any) {
        console.error('PrintQR page error:', error);

        return (
            <div className="p-8">
                <div className="max-w-md mx-auto text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading QR Page</h1>
                    <div className="text-left bg-gray-100 p-4 rounded mb-4">
                        <p className="text-sm text-gray-700 mb-2"><strong>Error Details:</strong></p>
                        <p className="text-sm text-red-600">{error.message || 'Unknown server error'}</p>
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
}
