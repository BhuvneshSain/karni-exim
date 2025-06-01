import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="sticky top-0 bg-white shadow z-50 px-4 py-2 flex justify-between items-center">
      <h1 className="text-xl font-bold">Karni Exim</h1>
      <div className="space-x-4">
        <NavLink to="/" className={({ isActive }) => isActive ? "font-bold text-blue-600" : ""}>Home</NavLink>
        <NavLink to="/products" className={({ isActive }) => isActive ? "font-bold text-blue-600" : ""}>Products</NavLink>
        <NavLink to="/about" className={({ isActive }) => isActive ? "font-bold text-blue-600" : ""}>About</NavLink>
        <NavLink to="/contact" className={({ isActive }) => isActive ? "font-bold text-blue-600" : ""}>Contact</NavLink>
      </div>
    </nav>
  );
};

export default Navbar;
