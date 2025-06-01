
import { NavLink } from 'react-router-dom';

const linkClass = ({ isActive }) =>
  `text-md px-3 py-2 transition-all ${
    isActive
      ? "text-blue-600 font-bold border-b-2 border-blue-600"
      : "text-gray-700 hover:text-blue-600"
  }`;

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-extrabold text-blue-900 tracking-wide">Karni Exim</h1>
        <div className="space-x-4">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/products" className={linkClass}>Products</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
