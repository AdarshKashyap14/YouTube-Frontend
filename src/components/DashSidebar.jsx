import { Sidebar } from 'flowbite-react';
import {
  HiArrowSmRight,
  HiOutlineUserGroup,
  HiChartPie,
} from 'react-icons/hi';
import { MdSubscriptions } from "react-icons/md";
import { BiSolidUserCircle } from "react-icons/bi";
import { IoVideocam } from "react-icons/io5";
import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { BASE_URL } from "../assets/constants";


export default function DashSidebar() {
  const location = useLocation();
  const dispatch = useDispatch();
  const {currentuser} = useSelector((state) => state.user);
  const [tab, setTab] = useState('');
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);
  const handleSignout = async () => {
    try {
        const res = await axios.post(`${BASE_URL}/api/v1/users/logout`);
      
      if (res.status!==200) {
        console.log(res.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <Sidebar className='w-full md:w-56'>
      <Sidebar.Items>
        <Sidebar.ItemGroup className='flex flex-col gap-1'>
          {currentuser  && (
            <Link to='/dashboard?tab=dash'>
              <Sidebar.Item
                active={tab === 'dash' || !tab}
                icon={HiChartPie}
                as='div'
              >
                Dashboard
              </Sidebar.Item>
            </Link>
          )}
          <Link to='/dashboard?tab=profile'>
            <Sidebar.Item
              active={tab === 'profile'}
              icon={ BiSolidUserCircle}
              label={currentuser.isAdmin ? 'Admin' : 'User'}
              labelColor='dark'
              as='div'
            >
              Profile
            </Sidebar.Item>
          </Link>
          {currentuser && (
            <Link to='/dashboard?tab=videos'>
              <Sidebar.Item
                active={tab === 'videos'}
                icon={IoVideocam}
                as='div'
              >
                Videos
              </Sidebar.Item>
            </Link>
          )}
          {currentuser && (
            <>
              <Link to='/dashboard?tab=subscribers'>
                <Sidebar.Item
                  active={tab === 'subscribers'}
                  icon={HiOutlineUserGroup}
                  as='div'
                >
                 Subscribers
                </Sidebar.Item>
              </Link>
              <Link to='/dashboard?tab=subscribed'>
                <Sidebar.Item
                  active={tab === 'subscribed'}
                  icon={MdSubscriptions}
                  as='div'
                >
                  Subscribed
                </Sidebar.Item>
              </Link>
            </>
          )}
          <Sidebar.Item
            icon={HiArrowSmRight}
            className='cursor-pointer'
            onClick={handleSignout}
          >
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
}