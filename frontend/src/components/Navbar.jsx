import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";


function Navbar({onLinkClick}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <nav className="flex items-center justify-center bg-farmGreen ">
      < div className="relative flex justify-between bg-white items-center h-16 mx-auto rounded-full w-[90%] lg:w-[70%] mt-6 mb-6 px-7">
        <h1 className="font-bold text-xl md:text-3xl">FarmMate Agrovet</h1>
        <div>
          <ul className="hidden lg:flex gap-4 list-none font-semibold text-lg">
            <button>
              Home
            </button>
            <button onClick={onLinkClick} className="hover:text-farmGreen">
              About
            </button>
            <button onClick={onLinkClick} className="hover:text-farmGreen">
              Contacts
            </button>
            <li className="hover:text-farmGreen">
              <NavLink to="/products">Shop</NavLink>
            </li>
            
          </ul>
        </div>

        <div className="lg:hidden flex items-center">
          <button onClick={toggleMenu}>
            <Menu size={28} />
          </button>
        </div>

        {/* Mobile and Tablet Menu */}
        {menuOpen && (
          <div className="absolute top-full right-4 lg:hidden bg-white rounded-lg px-6 z-50">
            <div className="flex justify-end">
              <button onClick={toggleMenu}>
                <X size={24} />
              </button>
            </div>

            <ul className="flex flex-col gap-4 font-semibold text-lg">
              <button onClick={toggleMenu} className="hover:text-farmGreen">
            
                  Home
                
              </button>
              <button className="hover:text-farmGreen" onClick={()=> {
                toggleMenu();
                onLinkClick();
              }}>
                 
                  About
               
              </button>
              <button className="hover:text-farmGreen" onClick={()=> {
                toggleMenu();
                onLinkClick();
              }}>
                
                  Contacts
                
              </button>
              <li className="hover:text-farmGreen">
                <NavLink to="/products" onClick={toggleMenu}>
                  Shop
                </NavLink>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
