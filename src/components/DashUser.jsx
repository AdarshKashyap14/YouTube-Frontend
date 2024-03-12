import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

export default function DashUser() {
  const { currentuser } = useSelector((state) => state.user);
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `/api/v1/users/channel/${currentuser.data.user.username}`
        );

        setUserDetails(response.data.data);
        console.log(response.data.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setIsLoading(false);
      }
    };

    if (currentuser && currentuser.data && currentuser.data.user) {
      fetchUserDetails();
    }
  }, [currentuser]);

  return (
    <div className="max-w-lg mx-auto p-3 w-full flex flex-col space-y-4">
      {isLoading && <div>Loading...</div>}
      {userDetails && (
        <div>
          <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>
          <div className="grid grid-cols-2 gap-4">
            {/* Subscription Count Card */}
            <div className="bg-blue-100 border border-blue-200 rounded-lg p-4 flex items-center justify-between shadow-md">
              <div>
                <h2 className="text-xl font-semibold text-blue-800">
                  Subscriptions
                </h2>
                <p className="text-gray-600">
                  {" "}
                  {userDetails.subscriptionCount}
                </p>
              </div>
              {/* You can add icons or additional elements here */}
            </div>

            {/* Subscriber Count Card */}
            <div className="bg-green-100 border border-green-400 rounded-lg p-4 flex items-center justify-between shadow-md">
              <div>
                <h2 className="text-xl font-semibold text-green-800">
                  Subscribers
                </h2>
                <p className="text-gray-600">{userDetails.subscriberCount}</p>
              </div>
              {/* You can add icons or additional elements here */}
            </div>
            <div className="border border-gray-200 rounded-lg p-4 shadow-md">
              <h2 className="text-xl font-semibold mb-4">User Details</h2>
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="py-2">Username</td>
                    <td className="py-2">{userDetails.username}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div
              className={`bg-${
                userDetails.isSubscribed ? "green" : "red"
              }-100 border border-${
                userDetails.isSubscribed ? "green" : "red"
              }-200 rounded-lg p-4 flex items-center justify-between shadow-md`}
            >
              <div>
                <h2
                  className={`text-xl font-semibold text-${
                    userDetails.isSubscribed ? "green" : "red"
                  }-800`}
                >
                  {userDetails.isSubscribed
                    ? "Channel is Subscribed"
                    : "Channel is Not Subscribed"}
                </h2>
                <p className="text-gray-600">
                  {userDetails.isSubscribed
                    ? "You are subscribed to this channel!"
                    : "Subscribe now to this channel!"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
