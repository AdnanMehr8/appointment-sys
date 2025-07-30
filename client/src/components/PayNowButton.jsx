import API from '../api/axios'; // or wherever your API instance is

export default function PayNowButton({ appointmentId }) {
  const handlePayNow = async () => {
    try {
      const res = await API.post('/payment/create-session', { appointmentId });

      if (res.data?.url) {
        window.location.href = res.data.url; // Redirect to Stripe
      } else {
        alert('Failed to create payment session');
      }
    } catch (error) {
      console.error(error);
      alert('Payment error');
    }
  };

  return (
    <button
      onClick={handlePayNow}
      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
    >
      Pay Now
    </button>
  );
}
