import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const navStyle = ({ isActive }) =>
    isActive
      ? "text-blue-600 font-semibold border-b-2 border-blue-600"
      : "text-gray-700 hover:text-blue-600";

  return (
    
    <nav className="sticky top-0 z-50 bg-white shadow-md">
        
      <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-800">Karni Exim</h1>
        <div className="space-x-6 text-md">
          <NavLink to="/" className={navStyle}>Home</NavLink>
          <NavLink to="/products" className={navStyle}>Products</NavLink>
          <NavLink to="/about" className={navStyle}>About</NavLink>
          <NavLink to="/contact" className={navStyle}>Contact</NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
