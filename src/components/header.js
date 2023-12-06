import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { CgProfile } from "react-icons/cg";

const Header = () => {
  const { logout , user} = useAuth0();
  const handleProfileClick = () => {
    // Redirect to the profile page
    window.location.href = "/profile";
  };
  const handleLogout = () => {
    logout({ returnTo: window.location.origin });
  };

  const profilePic = user && user.picture?
      <img className="w-8 h-8 rounded-full cursor-pointer flex items-center justify-center transform transition-transform hover:scale-105" src={user.picture} /> :
      <div
          className="w-8 h-8 bg-gray-200 rounded-full cursor-pointer flex items-center justify-center transform transition-transform hover:scale-105"
          onClick={handleProfileClick}
      >
        <CgProfile />
      </div>;

  return <div className="p-8 flex justify-between items-center bg-gray-900 text-white shadow-md">
    <div className="flex items-center">
      {profilePic}
      <span className="ml-2 cursor-pointer" onClick={handleProfileClick}>
            Profile
          </span>
    </div>
    <p className="text-xl font-bold">TaskMagnet</p>
    <button
        className="bg-red-500 text-white px-4 py-2 rounded"
        onClick={handleLogout}
    >
      Logout
    </button>
  </div>
};

export default Header;
