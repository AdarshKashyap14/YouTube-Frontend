import { Link, useNavigate, useLocation } from "react-router-dom";
import { Navbar, TextInput, Button, Dropdown, Avatar } from "flowbite-react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
import { useSelector } from "react-redux";
import { signoutSuccess } from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { RiVideoAddFill } from "react-icons/ri";
import { useState } from "react";
import { BASE_URL } from "../utils/constants";
import { toggleTheme } from "../redux/theme/themeSlice";

export default function Header() {
  const location = useLocation();
  const path = location.pathname;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentuser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/search/${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const handleSignout = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/users/logout`);

      if (response.status !== 200) {
        console.log(response.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Navbar className="border-b-2">
      <Link
        to="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          YouTube
        </span>
      </Link>
      <form onSubmit={handleSearch}>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill outline>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
        </Button>
        {currentuser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt="avatar"
                img={currentuser.data.user.avatar}
                size="sm"
                className="cursor-pointer"
                rounded
                bordered
              />
            }
          >
            <Dropdown.Header>
              <span className="block text-sm">
                {currentuser.data.user.fullname}
              </span>
            </Dropdown.Header>
            <Link to={"/dashboard?tab=profile"}>
              <Dropdown.Item>Profile</Dropdown.Item>
            </Link>
            <Dropdown.Divider />
            <Dropdown.Item onClick={handleSignout}>Sign out</Dropdown.Item>
          </Dropdown>
        ) : (
          <Link to="/sign-in">
            <Button gradientDuoTone="purpleToPink" pill outline>
              Signin
            </Button>
          </Link>
        )}

        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        {currentuser && (
          <Navbar.Link>
            <Link
              to="/create-video"
              active={path === "/create-video"}
              as={"div"}
            >
              <RiVideoAddFill />
            </Link>
          </Navbar.Link>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}
