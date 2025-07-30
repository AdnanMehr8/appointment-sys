export default function PaymentFailed() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="bg-white p-6 rounded shadow text-center">
        <h1 className="text-2xl font-bold text-red-700 mb-4">Payment Failed</h1>
        <p>Please try again later.</p>
      </div>
    </div>
  );
}
