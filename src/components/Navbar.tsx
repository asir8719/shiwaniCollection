import { Link, NavLink } from "react-router-dom";
import logo from "../assets/logo/siwani_collection.png";
import { CiSearch } from "react-icons/ci";
import { useState } from "react";

const Navbar = () => {
  const[searchTerm, setSearchTerm] = useState('');
  
  return (
    <header className="w-full bg-white border-b-2 border-b-[#cecede]">  
      <nav className="wContainer flex min-h-16 flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2 sm:px-6 lg:flex-nowrap lg:px-8">
        <div className="shrink-0">
          <Link to="/">
            <img 
              src={logo} 
              alt="Siwani Collection Logo" 
              width={120}
              height="auto"
            />
          </Link>
        </div>

        <ul className="navUl order-3 flex w-full justify-center gap-8 lg:order-0 lg:w-auto lg:gap-16">
          <li>
            <NavLink className={({ isActive }) => `${isActive ? 'text-(--text-hover)' : ''}`} to="/">Home</NavLink>
          </li>
          <li>
            <NavLink  className={({ isActive }) => `${isActive ? 'text-(--text-hover)' : ''}`} to="/product">Products</NavLink>
          </li>
        </ul>

        <div className="flex h-10 min-w-0 flex-1 items-center rounded border border-gray-500 px-3 md:max-w-60 lg:max-w-60 lg:flex-none">
          <CiSearch className="mr-2 text-2xl" />
          <input className="h-full min-w-0 flex-1 outline-none" type="text" name="search" id="product-search" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </nav>
    </header>
  )
}

export default Navbar