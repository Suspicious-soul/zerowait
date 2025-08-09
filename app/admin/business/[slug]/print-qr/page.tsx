type Props = { params: Promise<{ slug: string }> };

export const dynamic = 'force-dynamic';

export default async function PrintQR({ params }: Props) {
    try {
        console.log('PrintQR: Starting function execution');

        const { slug } = await params;
        console.log('PrintQR: Received slug:', slug);

        // Test basic functionality without database
        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold text-green-600">✅ Route Works!</h1>
                <div className="mt-4 p-4 bg-gray-100 rounded">
                    <p><strong>Slug received:</strong> <code>{slug}</code></p>
                    <p><strong>Server timestamp:</strong> {new Date().toISOString()}</p>
                    <p><strong>Status:</strong> Server-side rendering successful</p>
                </div>
                <div className="mt-4">
                    <a href="/admin" className="text-blue-600 hover:underline">← Back to Admin</a>
                </div>
            </div>
        );
    } catch (error: any) {
        console.error('PrintQR: Critical error:', error);

        return (
            <div className="p-8">
                <h1 className="text-red-600 text-2xl font-bold">❌ Error in Route</h1>
                <pre className="mt-4 p-4 bg-red-50 text-red-800 text-sm overflow-auto">
                    {error.message || 'Unknown error'}
                </pre>
            </div>
        );
    }
}
