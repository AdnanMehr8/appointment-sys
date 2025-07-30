import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import API from '../api/axios';

export default function ProviderAvailability() {
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => API.post('/availability', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['availability'] });
      setStart('');
      setEnd('');
      alert('Availability Saved');
    },
    onError: () => alert('Could not save availability'),
  });

  const handleSubmit = () => {
    if (!start || !end) return alert('Fill both fields');
    if (new Date(start) >= new Date(end)) return alert('Start must be before end');
    mutation.mutate({ startTime: start, endTime: end });
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Set Availability</h2>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Start Time</label>
          <input
            type="datetime-local"
            className="w-full border rounded px-3 py-2"
            value={start}
            onChange={(e) => setStart(e.target.value)}
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">End Time</label>
          <input
            type="datetime-local"
            className="w-full border rounded px-3 py-2"
            value={end}
            onChange={(e) => setEnd(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={mutation.isPending}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {mutation.isPending ? 'Saving...' : 'Save Availability'}
        </button>
      </div>
    </div>
  );
}
