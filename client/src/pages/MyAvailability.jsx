import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import API from '../api/axios';

export default function MyAvailability() {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');

 const { data: slots = [], isLoading } = useQuery({
  queryKey: ['myAvailability'],
  queryFn: async () => {
    const res = await API.get('/availability/mine');
    return res.data;
  },
});


  const deleteMutation = useMutation({
    mutationFn: (id) => API.delete(`/availability/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['myAvailability']);
      alert('Deleted!');
    },
    onError: (e) => alert(e.response?.data?.message || 'Delete failed'),
  });

  const editMutation = useMutation({
    mutationFn: ({ id, startTime, endTime }) =>
      API.put(`/availability/${id}`, { startTime, endTime }),
    onSuccess: () => {
      queryClient.invalidateQueries(['myAvailability']);
      setEditing(null);
      alert('Updated!');
    },
    onError: (e) => alert(e.response?.data?.message || 'Update failed'),
  });

  const startEdit = (slot) => {
    setEditing(slot.id);
    setStart(slot.startTime.slice(0, 16));
    setEnd(slot.endTime.slice(0, 16));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">My Availability</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : slots.length === 0 ? (
        <p>No availability found.</p>
      ) : (
        <table className="w-full table-auto border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Start</th>
              <th className="p-2">End</th>
              <th className="p-2">Booked</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot) => (
              <tr key={slot.id} className="border-t">
                <td className="p-2">
                  {editing === slot.id ? (
                    <input
                      type="datetime-local"
                      value={start}
                      onChange={(e) => setStart(e.target.value)}
                      className="border px-2 py-1"
                    />
                  ) : (
                    new Date(slot.startTime).toLocaleString()
                  )}
                </td>
                <td className="p-2">
                  {editing === slot.id ? (
                    <input
                      type="datetime-local"
                      value={end}
                      onChange={(e) => setEnd(e.target.value)}
                      className="border px-2 py-1"
                    />
                  ) : (
                    new Date(slot.endTime).toLocaleString()
                  )}
                </td>
                <td className="p-2">{slot.booked ? '✅' : '❌'}</td>
                <td className="p-2 space-x-2">
                  {!slot.booked && editing !== slot.id && (
                    <button
                      className="text-blue-600"
                      onClick={() => startEdit(slot)}
                    >
                      Edit
                    </button>
                  )}
                  {!slot.booked && editing === slot.id && (
                    <button
                      className="text-green-600"
                      onClick={() =>
                        editMutation.mutate({
                          id: slot.id,
                          startTime: start,
                          endTime: end,
                        })
                      }
                    >
                      Save
                    </button>
                  )}
                  {!slot.booked && (
                    <button
                      className="text-red-600"
                      onClick={() => deleteMutation.mutate(slot.id)}
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
