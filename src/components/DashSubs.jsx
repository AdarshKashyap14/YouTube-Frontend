import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Avatar, List } from 'flowbite-react';
import { BASE_URL } from "../assets/constants";


export default function DashSubs() {
  const { currentuser } = useSelector((state) => state.user);
  const [subscribedChannels, setSubscribedChannels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSubscribedChannels = async () => {
      try {
        setIsLoading(true);
        // Fetch subscribed channels from the server
        const response = await axios.get(
          `${BASE_URL}/api/v1/subscriptions/u/${currentuser.data.user._id}`
        );
        if (response.status === 200) {
          console.log(response.data.data.subscribers);
          setSubscribedChannels(response.data.data.subscribers);
        }
      } catch (error) {
        console.error("Error fetching subscribed channels:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscribedChannels();
  }, []); // Empty dependency array ensures the effect runs only once

  return (
    <div className="max-w-xl mx-auto p-3 w-full">
    <h1 className="text-2xl font-bold mb-4">Subscribers List</h1>
    {isLoading ? (
      <div>Loading...</div>
    ) : (
      <div>
        {subscribedChannels.length === 0 ? (
          <div>No one Subscribed you yet keep uploading videos.</div>
        ) : (
          <ul>
            {subscribedChannels.map((channel) => (
              <List unstyled key={channel._id} className="flex items-center gap-4 py-2 border-b border-gray-200">
                <Avatar img={channel.avatar} alt={channel.username} rounded bordered  />
                <div>
                  <div className="text-lg font-bold">{channel.username}</div>
                  <div className="text-gray-500">{channel.fullname}</div>
                 
                </div>
              </List>
            ))}
          </ul>
        )}
      </div>
    )}
  </div>
  
  );
}
