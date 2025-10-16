import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, ChevronDown, Search, User, Menu, X } from "lucide-react";
import { CartContext } from "../apiRequests/CartProvider";
import { AuthContext } from "../apiRequests/AuthProvider";
import { useContext, useState } from "react";

function ProductsNavbar({ setSelectedCategory, searchTerm, setSearchTerm }) {
  const navigate = useNavigate();
  const { logOut, user } = useContext(AuthContext);

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const { cart } = useContext(CartContext);

  // Calculate total quantity (in case items have quantities >1)
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  const [showCategories, setShowCategories] = useState(false);
  const [showMobileCategories, setShowMobileCategories] = useState(false);

  return (
    <nav className="bg-farmGreen py-4">
      <div className="relative flex justify-between items-center bg-white h-16 rounded-full w-[80%] mx-auto px-7 shadow-lg">
        <h1 className="font-bold sm:text-lg md:text-xl lg:text-xl text-farmGreen">
          FarmMate Agrovet
        </h1>
        <div className="relative  w-[40%]">
          <input
            type="text"
            placeholder="Search Products ..."
            className="px-2 w-full h-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-farmGreen"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <ul className="hidden lg:flex gap-6 font-semibold text-lg ">
            {user?.role === "admin" && (
              <li className="hover:text-farmGreen">
                <NavLink to="/admin">Admin</NavLink>
              </li>
            )}

            <li className="hover:text-farmGreen">
              <NavLink to="/">Home</NavLink>
            </li>
            <li className="relative">
              <button
                onClick={() => setShowCategories((prevState) => !prevState)}
                className="flex items-center gap-1 hover:text-farmGreen"
              >
                categories <ChevronDown size={18} />
              </button>
              {showCategories && (
                <ul className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-lg overflow-hidden">
                  <li
                    onClick={() => setSelectedCategory(null)}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    All{" "}
                  </li>
                  <li
                    onClick={() => setSelectedCategory("Pesticide")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Pesticides{" "}
                  </li>
                  <li
                    onClick={() => setSelectedCategory("Fertilizer")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Fertilizers{" "}
                  </li>
                  <li
                    onClick={() => setSelectedCategory("Equipment")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Farm Equipment{" "}
                  </li>
                  <li
                    onClick={() => setSelectedCategory("AnimalFeed")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Animal Feeds{" "}
                  </li>
                  <li
                    onClick={() => setSelectedCategory("Herbicide")}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    Herbicides{" "}
                  </li>
                </ul>
              )}
            </li>
            <li className="relative">
              <NavLink
                to="/cart"
                className="flex items-center gap-1 hover:text-farmGreen "
              >
                <ShoppingCart size={24} />
                {cartItemCount > 0 && (
                  <span className="absolute top-[-5px] right-[-8px] bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full ">
                    {cartItemCount}
                  </span>
                )}
              </NavLink>
            </li>

            <li>
              <NavLink to="/signup" className="hover:text-farmGreen">
                SignUp
              </NavLink>
            </li>
            <li>
              <button
                onClick={() => {
                  logOut(); // Calling the logout function

                  navigate("/"); // Redirect after logout
                }}
                className="hover:text-farmGreen"
              >
                Logout
              </button>
            </li>
            <li>
              <NavLink to="/login" className="hover:text-farmGreen">
                <User size={20} />
              </NavLink>
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

            <ul className="flex flex-col gap-4 font-semibold text-lg ">
              {user?.role === "admin" && (
                <li className="hover:text-farmGreen">
                  <NavLink to="/admin">Admin</NavLink>
                </li>
              )}
              <li className="hover:text-farmGreen">
                <NavLink to="/" onClick={toggleMenu}>
                  Home
                </NavLink>
              </li>
              <li>
                <button
                  onClick={() => setShowMobileCategories((prev) => !prev)}
                  className="hover:text-farmGreen"
                >
                  Categories
                </button>

                {showMobileCategories && (
                  <div className="absolute top-16 right-32 w-40 bg-white rounded-lg shadow-lg p-4 z-50">
                    <ul className="flex flex-col space-y-2 font-semibold text-md">
                      <li
                        onClick={() => {
                          setSelectedCategory(null);
                          setShowMobileCategories(false);
                          toggleMenu();
                        }}
                        className="cursor-pointer hover:text-farmGreen"
                      >
                        All
                      </li>
                      <li
                        onClick={() => {
                          setSelectedCategory("Pesticide");
                          setShowMobileCategories(false);
                          toggleMenu();
                        }}
                        className="cursor-pointer hover:text-farmGreen"
                      >
                        Pesticides
                      </li>
                      <li
                        onClick={() => {
                          setSelectedCategory("Fertilizer");
                          setShowMobileCategories(false);
                          toggleMenu();
                        }}
                        className="cursor-pointer hover:text-farmGreen"
                      >
                        Fertilizers
                      </li>
                      <li
                        onClick={() => {
                          setSelectedCategory("Equipment");
                          setShowMobileCategories(false);
                          toggleMenu();
                        }}
                        className="cursor-pointer hover:text-farmGreen"
                      >
                        Farm Equipment
                      </li>
                      <li
                        onClick={() => {
                          setSelectedCategory("AnimalFeed");
                          setShowMobileCategories(false);
                          toggleMenu();
                        }}
                        className="cursor-pointer hover:text-farmGreen"
                      >
                        Animal Feeds
                      </li>
                      <li
                        onClick={() => {
                          setSelectedCategory("Herbicide");
                          setShowMobileCategories(false);
                          toggleMenu();
                        }}
                        className="cursor-pointer hover:text-farmGreen"
                      >
                        Herbicides
                      </li>
                    </ul>
                  </div>
                )}
              </li>

              <li>
                <NavLink
                  to="/cart"
                  className="hover:text-farmGreen"
                  onClick={toggleMenu}
                >
                  <ShoppingCart size={24} />
                  {cartItemCount > 0 && (
                    <span className="absolute top-[100px] right-[75px] bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full ">
                      {cartItemCount}
                    </span>
                  )}
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/signup"
                  className="hover:text-farmGreen"
                  onClick={toggleMenu}
                >
                  Sign Up
                </NavLink>
              </li>
              <li>
                <button
                  onClick={() => {
                    logOut(); // Calling the logout function

                    navigate("/"); // Redirect after logout
                  }}
                  className="hover:text-farmGreen"
                >
                  Logout
                </button>
              </li>
              <li>
                <NavLink
                  to="/login"
                  className="hover:text-farmGreen"
                  onClick={toggleMenu}
                >
                  <User size={20} />
                </NavLink>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

export default ProductsNavbar;
