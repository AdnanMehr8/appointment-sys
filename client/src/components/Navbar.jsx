import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();

    if (!user) return null;

    return (
        <nav className="bg-blue-600 text-white p-4 flex justify-between">
            <span className="font-bold text-lg">Appointment App</span>
            <div className="space-x-4">
                {user.role === 'CUSTOMER' && <Link to="/book" className="hover:underline">Book</Link>}
                {user.role === 'PROVIDER' && (
                    <>
                        <Link to="/availability" className="hover:underline">Add Slot</Link>
                        <Link to="/my-availability" className="hover:underline">My Availability</Link>
                    </>
                )}

                <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                <button onClick={logout} className="ml-2 bg-red-500 px-2 py-1 rounded hover:bg-red-600">Logout</button>
            </div>
        </nav>
    );
}
