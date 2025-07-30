import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import API from '../api/axios';
import { useAuth } from '../auth/AuthContext';
import { Link } from 'react-router-dom';
import PayNowButton from '../components/PayNowButton';

export default function Dashboard() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);
  const [itemsPerPage] = useState(5); // Appointments per page

  const cancelMutation = useMutation({
    mutationFn: (id) => API.delete(`/appointments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
      alert('Appointment canceled');
    },
    onError: (err) => {
      alert(err?.response?.data?.message || 'Failed to cancel appointment');
    },
  });

  const { data: appointments = [] } = useQuery({
    queryKey: ['appointments'],
    queryFn: async () => {
      const res = await API.get('/appointments');
      return Array.isArray(res.data) ? res.data : res.data.data || [];
    },
  });

  const now = new Date();

const upcomingAppointments = appointments.filter((a) => {
  const appointmentDate = new Date(a.date);
  return appointmentDate >= now; 
});

const pastAppointments = appointments.filter((a) => {
  const appointmentDate = new Date(a.date);
  return appointmentDate < now;
});

  const paginateArray = (array, page, itemsPerPage) => {
    const startIndex = (page - 1) * itemsPerPage;
    return array.slice(startIndex, startIndex + itemsPerPage);
  };

  const paginatedUpcoming = paginateArray(upcomingAppointments, upcomingPage, itemsPerPage);
  const paginatedPast = paginateArray(pastAppointments, pastPage, itemsPerPage);

  const upcomingTotalPages = Math.ceil(upcomingAppointments.length / itemsPerPage);
  const pastTotalPages = Math.ceil(pastAppointments.length / itemsPerPage);

  const PaginationControls = ({ currentPage, totalPages, onPageChange, totalItems }) => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between mt-4 px-2">
        <div className="text-sm text-gray-600">
          Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-3 py-1 text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user.name}</h2>

      <div className="mb-6 space-x-4">
        {user.role === 'CUSTOMER' && (
          <Link to="/book" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Book Appointment
          </Link>
        )}
        {user.role === 'PROVIDER' && (
          <Link to="/availability" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Set Availability
          </Link>
        )}
      </div>

      <h3 className="text-xl font-semibold mt-6">
        Upcoming Appointments 
        {upcomingAppointments.length > 0 && (
          <span className="text-sm font-normal text-gray-600 ml-2">
            ({upcomingAppointments.length} total)
          </span>
        )}
      </h3>
      <div className="space-y-2">
        {paginatedUpcoming.length === 0 ? (
          <p className="text-gray-500">No upcoming appointments.</p>
        ) : (
          paginatedUpcoming.map((a) => (
            <div key={a.id} className="p-4 border rounded shadow flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">{new Date(a.date).toLocaleString()}</p>
                <p>
                  {user.role === 'CUSTOMER'
                    ? `With: ${a.provider?.name || 'Unknown Provider'}`
                    : `Booked by: ${a.customer?.name || 'Unknown Customer'}`}
                </p>
                {user.role === 'CUSTOMER' && (
                  a.paid ? (
                    <span className="text-green-600 font-semibold">Paid</span>
                  ) : (
                    <PayNowButton appointmentId={a.id} />
                  )
                )}
              </div>
              {user.role === 'CUSTOMER' && (
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to cancel this appointment?')) {
                      cancelMutation.mutate(a.id);
                    }
                  }}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Cancel
                </button>
              )}
            </div>
          ))
        )}
      </div>
      
      <PaginationControls
        currentPage={upcomingPage}
        totalPages={upcomingTotalPages}
        onPageChange={setUpcomingPage}
        totalItems={upcomingAppointments.length}
      />

      <h3 className="text-xl font-semibold mt-8">
        Past Appointments
        {pastAppointments.length > 0 && (
          <span className="text-sm font-normal text-gray-600 ml-2">
            ({pastAppointments.length} total)
          </span>
        )}
      </h3>
      <div className="space-y-2">
        {paginatedPast.length === 0 ? (
          <p className="text-gray-500">No past appointments.</p>
        ) : (
          paginatedPast.map((a) => (
            <div key={a.id} className="p-4 border rounded shadow flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">{new Date(a.date).toLocaleString()}</p>
                <p>
                  {user.role === 'CUSTOMER'
                    ? `With: ${a.provider?.name || 'Unknown Provider'}`
                    : `Booked by: ${a.customer?.name || 'Unknown Customer'}`}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      
      <PaginationControls
        currentPage={pastPage}
        totalPages={pastTotalPages}
        onPageChange={setPastPage}
        totalItems={pastAppointments.length}
      />
    </div>
  );
}