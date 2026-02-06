import { HelpCircle, LogOut, Search, Settings } from "lucide-react";
import Logo from "../assets/logo.png";
import { Link, useNavigate } from "react-router";
import { useAuthStore } from "../store/authStore";
import { useState } from "react";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const avatarUrl = user
    ? `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
      user.username
    )}`
    : "";

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleLogout = async () => {
    const { message } = await logout();
    toast.success(message);
    setShowMenu(false);
  };

  return (
    <nav className="bg-black text-gray-200 flex justify-between items-center p-4 h-20 text-sm md:text-[15px] font-medium text-nowrap">
      <Link to={"/"}>
        <img
          src={Logo}
          alt="Logo"
          className="w-24 cursor-pointer brightness-125"
        />
      </Link>

      <ul className="hidden xl:flex space-x-6">
        <Link to="/"><li className="cursor-pointer hover:text-[#e50914]">Home</li></Link>
        <Link to="/tv-shows"><li className="cursor-pointer hover:text-[#e50914]">Tv Shows</li></Link>
        <Link to="/movies"><li className="cursor-pointer hover:text-[#e50914]">Movies</li></Link>
        <Link to="/anime"><li className="cursor-pointer hover:text-[#e50914]">Anime</li></Link>
        <Link to="/new-popular"><li className="cursor-pointer hover:text-[#e50914]">New & Popular</li></Link>
        <Link to="/upcoming"><li className="cursor-pointer hover:text-[#e50914]">Upcoming</li></Link>
      </ul>

      <div className="flex items-center space-x-4 relative">
        <form onSubmit={handleSearch} className="relative hidden md:inline-flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#333333] px-4 py-2 rounded-full min-w-72 pr-10 outline-none"
            placeholder="Search movies, TV shows..."
          />
          <button type="submit" className="absolute top-2 right-4">
            <Search className="w-5 h-5 hover:text-[#e50914] cursor-pointer" />
          </button>
        </form>

        <Link to={user ? "ai-recommendations" : "signin"}>
          <button className="bg-[#e50914] px-5 py-2 text-white cursor-pointer">
            Get AI Movie Picks
          </button>
        </Link>

        {!user ? (
          <Link to={"/signin"}>
            <button className="border border-[#333333] py-2 px-4 cursor-pointer">
              Sign In
            </button>
          </Link>
        ) : (
          <div className="text-white">
            <img
              src={avatarUrl}
              alt=""
              className="w-10 h-10 rounded-full border-2 border-[#e50914] cursor-pointer"
              onClick={() => setShowMenu(!showMenu)}
            />

            {showMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-[#232323] bg-opacity-95 rounded-lg z-50 shadow-lg py-4 px-3 flex flex-col gap-2 border border-[#333333]">
                <div className="flex flex-col items-center mb-2">
                  <span className="text-white font-semibold text-base">
                    {user.username}
                  </span>
                  <span className="text-xs text-gray-400">{user.email}</span>
                </div>

                <button className="flex items-center px-4 py-3 rounded-lg text-white bg-[#181818] hover:bg-[#1d1c1c] gap-3 cursor-pointer">
                  <HelpCircle className="w-5 h-5" />
                  Help Center
                </button>

                <button className="flex items-center px-4 py-3 rounded-lg text-white bg-[#181818] hover:bg-[#1d1c1c] gap-3 cursor-pointer">
                  <Settings className="w-5 h-5" />
                  Settings
                </button>

                <button
                  onClick={handleLogout}
                  className="flex items-center px-4 py-3 rounded-lg text-white bg-[#181818] hover:bg-[#1d1c1c] gap-3 cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  Log Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
