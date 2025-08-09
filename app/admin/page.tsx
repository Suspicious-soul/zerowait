export default function AdminDashboard() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <a
                href="/admin/business/test-salon-priya-ab62/print-qr"
                className="block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-center"
              >
                Print QR for Test Salon
              </a>
              <a
                href="/api/create-business"
                target="_blank"
                className="block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-center"
              >
                Test API Endpoint
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
