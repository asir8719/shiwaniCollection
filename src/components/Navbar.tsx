import type { FormEvent } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";
import logo from "../assets/logo/siwani_collection.png";
import { Search } from "lucide-react";

const Navbar = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const query = String(formData.get("search") ?? "").trim();
    navigate(query ? `/product?search=${encodeURIComponent(query)}` : "/product");
  };
  
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

        <form
          role="search"
          onSubmit={handleSearch}
          className="flex h-10 min-w-0 flex-1 items-center rounded border border-gray-500 px-3 md:max-w-60 lg:max-w-60 lg:flex-none"
        >
          <label className="sr-only" htmlFor="product-search">Search products</label>
          <Search aria-hidden="true" className="mr-2 size-5 shrink-0 text-gray-600" />
          <input
            className="h-full min-w-0 flex-1 outline-none"
            type="search"
            name="search"
            id="product-search"
            placeholder="Search products..."
            defaultValue={searchParams.get("search") ?? ""}
          />
          <button
            type="submit"
            className="ml-2 text-sm font-medium text-[#9f2089] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9f2089]"
          >
            Search
          </button>
        </form>
      </nav>
    </header>
  )
}

export default Navbar