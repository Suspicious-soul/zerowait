import { createClient } from '@supabase/supabase-js';

type Props = { params: Promise<{ id: string }> };

export const dynamic = 'force-dynamic';

async function getBusiness(id: string) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', id)
        .single();

    if (error) throw new Error(error.message);
    return data;
}

export default async function PrintQR({ params }: Props) {
    const { id } = await params;
    const business = await getBusiness(id);

    return (
        <div className="p-8">
            {/* Print styles handled by Tailwind's print: modifier */}
            <div className="print:hidden mb-4 space-x-2">
                <button
                    className="px-4 py-2 rounded bg-black text-white hover:bg-gray-800 print-btn"
                >
                    Print QR Code
                </button>
                <a
                    href={business.qr_url}
                    target="_blank"
                    className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                    Download QR
                </a>
            </div>

            <div className="border-2 border-gray-300 p-8 rounded-lg max-w-md mx-auto text-center space-y-6 bg-white print:border-0 print:shadow-none">
                <div>
                    <h1 className="text-3xl font-bold text-gray-800">{business.name}</h1>
                    <p className="text-lg text-gray-600 mt-2">{business.address}</p>
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
                    <p className="text-red-500">QR code not found</p>
                )}
            </div>

            {/* Add print button functionality with inline script */}
            <script dangerouslySetInnerHTML={{
                __html: `
          document.addEventListener('DOMContentLoaded', function() {
            const printBtn = document.querySelector('.print-btn');
            if (printBtn) {
              printBtn.addEventListener('click', function() {
                window.print();
              });
            }
          });
        `
            }} />
        </div>
    );
}
