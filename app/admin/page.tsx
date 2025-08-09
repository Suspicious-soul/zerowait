import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

async function getBusinesses() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { data } = await supabase
    .from('businesses')
    .select('name, slug')
    .limit(10);

  return data || [];
}

export default async function AdminDashboard() {
  const businesses = await getBusinesses();

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Businesses</h2>
            <div className="space-y-3">
              {businesses.map((business) => (
                <a
                  key={business.slug}
                  href={`/admin/business/${business.slug}/print-qr`}
                  className="block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center"
                >
                  Print QR for {business.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
