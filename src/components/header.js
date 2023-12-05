import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { CgProfile } from "react-icons/cg";

const Header = () => {
  const { logout } = useAuth0();
  const handleProfileClick = () => {
    // Redirect to the profile page
    window.location.href = "/profile";
  };
  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  <div className="p-8 flex justify-between items-center bg-gray-900 text-white shadow-md">
    <div className="flex items-center">
      <div
        className="w-8 h-8 bg-gray-200 rounded-full cursor-pointer flex items-center justify-center"
        onClick={handleProfileClick}
      >
        {<CgProfile />}
      </div>
      <span className="ml-2 cursor-pointer" onClick={handleProfileClick}>
        Profile
      </span>
    </div>
    <p className="text-xl font-bold">ClassMagnet</p>
    {/* Logout Button */}
    <button
      className="bg-red-500 text-white px-4 py-2 rounded"
      onClick={handleLogout}
    >
      Logout
    </button>
  </div>;
};

export default Header;
