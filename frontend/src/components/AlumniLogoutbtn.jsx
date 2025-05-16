import { useNavigate } from 'react-router-dom';

function AlumniLogoutbtn() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear token or session
    localStorage.removeItem('alumniToken');

    // Redirect to login
    navigate('/alumni-login');
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
    >
      Logout
    </button>
  );
}
export default AlumniLogoutbtn
