// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useState } from "react";

const Navbar = () => {
  const [megaOpen, setMegaOpen] = useState(false);

  return (
    <nav className="bg-white shadow relative z-50">
      {/* Wrapper relative to position mega menu */}
      <div className="relative max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <div className="text-2xl font-bold">Framed</div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6 items-center text-gray-700 font-medium">
          <li><Link to="/" className="hover:text-blue-600">Digital Upload</Link></li>

          {/* Mega Menu Trigger */}
          <li
            className="relative"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <span className="cursor-pointer hover:text-blue-600">Mail In / Frame Only</span>
          </li>

          <li><Link to="/" className="hover:text-blue-600">Collections</Link></li>
          <li><Link to="/" className="hover:text-blue-600">Marketplace</Link></li>
          <li><Link to="/" className="hover:text-blue-600">Trade</Link></li>
          <li><Link to="/" className="hover:text-blue-600">Sell Your Art</Link></li>
          <li><Link to="/" className="hover:text-blue-600">Framing for Business</Link></li>
          <li>
            <Link to="/signin" className="ml-4 px-4 py-2 border rounded hover:bg-gray-100">Sign In</Link>
          </li>
        </ul>

        {/* Mega Menu Positioned Full Width Below Navbar */}
        {megaOpen && (
          <div
            className="absolute left-0 top-full w-full bg-white shadow-lg border-t border-gray-200 overflow-auto"
            style={{ height: '50vh' }}
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <div className="max-w-7xl mx-auto grid grid-cols-5 gap-6 p-6 h-full">
              {/* Column 1 */}
              <div>
                <h3 className="font-bold mb-2">What are you framing?</h3>
                <p className="text-gray-600 text-sm">
                  We have the perfect recommendation for whatever you’re framing.
                </p>
              </div>

              {/* Column 2 */}
              <div>
                <h3 className="font-semibold mb-2">Frames for Art</h3>
                <ul className="space-y-1 text-gray-700">
                  <li><Link to="/" className="hover:text-blue-600">Original Art</Link></li>
                  <li><Link to="/" className="hover:text-blue-600">Art Print</Link></li>
                  <li><Link to="/" className="hover:text-blue-600">Fine Art Photo</Link></li>
                  <li><Link to="/" className="hover:text-blue-600">Personal Photo</Link></li>
                  <li><Link to="/" className="hover:text-blue-600">Poster</Link></li>
                </ul>
              </div>

              {/* Column 3 */}
              <div>
                <h3 className="font-semibold mb-2">Frames for Fabric</h3>
                <ul className="space-y-1 text-gray-700">
                  <li><Link to="/" className="hover:text-blue-600">Scarf</Link></li>
                  <li><Link to="/" className="hover:text-blue-600">Textile</Link></li>
                </ul>
              </div>

              {/* Column 4 */}
              <div>
                <h3 className="font-semibold mb-2">Frames for Documents</h3>
                <ul className="space-y-1 text-gray-700">
                  <li><Link to="/" className="hover:text-blue-600">Certificate</Link></li>
                  <li><Link to="/" className="hover:text-blue-600">Diploma</Link></li>
                  <li><Link to="/" className="hover:text-blue-600">Ketubah</Link></li>
                </ul>
              </div>

              {/* Column 5 - Image */}
              <div className="flex items-center justify-center">
                <img
                  src="https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=200"
                  alt="Framing Example"
                  className="rounded-lg object-cover h-full w-full"
                />
              </div>
            </div>
          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;
