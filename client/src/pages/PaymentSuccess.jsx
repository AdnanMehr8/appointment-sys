import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API from '../api/axios'; // import your configured axios

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('appointmentId');
  const [status, setStatus] = useState('Processing...');
  const navigate = useNavigate();

  useEffect(() => {
    if (appointmentId) {
      API.post('/payment/webhook', { appointmentId })
        .then(() => {
          setStatus('Payment successful! Appointment marked as paid.');
          setTimeout(() => navigate('/dashboard'), 3000);
        })
        .catch(() => {
          setStatus('Something went wrong.');
        });
    }
  }, [appointmentId]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-6 rounded shadow text-center">
        <h1 className="text-2xl font-bold text-green-700 mb-4">{status}</h1>
        <p>You’ll be redirected shortly...</p>
      </div>
    </div>
  );
}
