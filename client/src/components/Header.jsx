import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/theme/themeSlice';
import { signoutSuccess } from '../redux/user/userSlice';
import { useState } from 'react';

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const path = location.pathname;

  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  // ✅ bez useEffect warninga
  const searchFromUrl =
    new URLSearchParams(location.search).get('searchTerm') || '';
  const [searchTerm, setSearchTerm] = useState(searchFromUrl);

  const handleSignout = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/signout`,
        {
          method: 'POST',
          credentials: 'include',
        }
      );
      if (res.ok) {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?searchTerm=${searchTerm}`);
  };

  return (
    <Navbar className='border-b-2'>
      {/* LOGO */}
      <Button
        as={Link}
        to='/'
        color='gray'
        className='self-center whitespace-nowrap text-sm sm:text-xl font-semibold'
      >
        <span className='px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white'>
          Sahand&apos;s
        </span>
        <span className='ml-1'>Blog</span>
      </Button>

      {/* SEARCH */}
      <form onSubmit={handleSubmit}>
        <TextInput
          type='text'
          placeholder='Search...'
          rightIcon={AiOutlineSearch}
          className='hidden lg:inline'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>

      <Button className='w-12 h-10 lg:hidden' color='gray' pill>
        <AiOutlineSearch />
      </Button>

      {/* RIGHT SIDE */}
      <div className='flex gap-2 md:order-2'>
        {/* THEME TOGGLE */}
        <Button
          className='w-12 h-10 hidden sm:inline'
          color='gray'
          pill
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === 'light' ? <FaSun /> : <FaMoon />}
        </Button>

        {/* USER MENU */}
        {currentUser ? (
          <Dropdown
            arrowIcon={false}
            inline
            label={
              <Avatar
                alt='user'
                img={currentUser.profilePicture}
                rounded
              />
            }
          >
            <Dropdown.Header>
              <span className='block text-sm'>
                @{currentUser.username}
              </span>
              <span className='block text-sm font-medium truncate'>
                {currentUser.email}
              </span>
            </Dropdown.Header>

            <Dropdown.Item as={Link} to='/dashboard?tab=profile'>
              Profile
            </Dropdown.Item>

            <Dropdown.Divider />

            <Dropdown.Item onClick={handleSignout}>
              Sign out
            </Dropdown.Item>
          </Dropdown>
        ) : (
          // ✅ UMESTO gradientDuoTone
          <Button
            as={Link}
            to='/sign-in'
            className='bg-gradient-to-r from-purple-500 to-blue-500 text-white'
          >
            Sign In
          </Button>
        )}

        <Navbar.Toggle />
      </div>

      {/* NAV LINKS */}
      <Navbar.Collapse>
        <Navbar.Link active={path === '/'} as={Link} to='/'>
          Home
        </Navbar.Link>
        <Navbar.Link active={path === '/about'} as={Link} to='/about'>
          About
        </Navbar.Link>
        <Navbar.Link active={path === '/projects'} as={Link} to='/projects'>
          Projects
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  );
}
