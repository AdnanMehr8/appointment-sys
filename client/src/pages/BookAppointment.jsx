import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../api/axios';

export default function BookAppointment() {
  const queryClient = useQueryClient();

  const { data: slots = [], isLoading } = useQuery({
    queryKey: ['availability'],
    queryFn: async () => {
      const res = await API.get('/availability');
      return res.data;
    },
  });

  const bookMutation = useMutation({
    mutationFn: (data) => API.post('/appointments/book', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      alert('Appointment Booked');
    },
    onError: (error) => {
  if (error?.response?.status === 409) {
    alert('This slot is already booked. Please choose another.');
  } else {
    alert('Something went wrong. Try again.');
  }
}



  });

  const groupedByProvider = slots.reduce((acc, slot) => {
    const providerName = slot.provider?.name || 'Unknown';
    if (!acc[providerName]) acc[providerName] = [];
    acc[providerName].push(slot);
    return acc;
  }, {});

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">📅 Book an Appointment</h2>

      {isLoading ? (
        <p>Loading slots...</p>
      ) : slots.length === 0 ? (
        <p className="text-gray-500">No available slots found.</p>
      ) : (
        Object.entries(groupedByProvider).map(([provider, slots]) => (
          <div key={provider} className="mb-8">
            <h3 className="text-lg font-semibold mb-3 text-blue-700">{provider}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {slots.map((slot) => (
                <button
                  key={slot.id}
                  onClick={() =>
                    bookMutation.mutate({
                      providerId: slot.providerId,
                      date: slot.startTime,
                    })
                  }
                  disabled={bookMutation.isPending}
                  className="p-3 text-left bg-blue-100 hover:bg-blue-200 border rounded transition text-sm"
                >
                  {new Date(slot.startTime).toLocaleString()}
                </button>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
