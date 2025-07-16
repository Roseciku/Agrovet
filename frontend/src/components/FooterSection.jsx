import React from 'react'

function FooterSection({linksRef, isActive, onLinkClick }) {

  return (
    <footer 
    ref={linksRef} 
    className={`bg-gray-900 text-white py-8 px-4 font-poppins transition-colors duration-500 ${
    isActive ? "bg-gray-600 border-2 border-gray-600" : "bg-gray-900"
  }`}>
  <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
    
    {/* Company Info */}
    <div>
      <h2 className="text-xl font-semibold mb-4">FarmMate Agrovet</h2>
      <p className="text-sm">
        Farming made easy, growth made possible
      </p>
    </div>

    {/* Contact Info */}
    <div>
      <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
      <ul className="text-sm space-y-2">
        <li>Email: <a href="mailto:info@farmmate.com" className="text-blue-300 hover:underline">info@farmmate.com</a></li>
        <li>Phone: <a href="tel:+254700000000" className="text-blue-300 hover:underline">+254 700 000000</a></li>
        <li>Location: Nyeri, Kenya</li>
      </ul>
    </div>

    {/* Quick Links */}
    <div>
      <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
      <ul className="text-sm space-y-2">
        <li><a href="/products" className="hover:text-brightYellow">Products</a></li>
        <li><a href="/products" className="hover:text-brightYellow">Shop</a></li>
      
      </ul>
    </div>

  </div>

  {/* Bottom bar */}
  <div className="text-center text-xs mt-8 text-gray-400">
    &copy; {new Date().getFullYear()} FarmMate Agrovet. All rights reserved.
  </div>
</footer>

  )
}

export default FooterSection