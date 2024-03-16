import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams , Link } from 'react-router-dom';

function SearchPage() {
  const { searchQuery } = useParams();
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  function formatTimeDifference(createdAt) {
    // Convert createdAt to a Date object
    const createdAtDate = new Date(createdAt);

    // Get the current time
    const currentTime = new Date();

    // Calculate the difference in milliseconds
    const timeDifference = currentTime - createdAtDate;

    // Convert milliseconds to seconds
    const secondsDifference = Math.floor(timeDifference / 1000);

    // Convert seconds to minutes
    const minutesDifference = Math.floor(secondsDifference / 60);

    if (minutesDifference < 60) {
      return `${minutesDifference} ${
        minutesDifference === 1 ? "minute" : "minutes"
      } ago`;
    } else {
      const hoursDifference = Math.floor(minutesDifference / 60);
      if (hoursDifference < 24) {
        return `${hoursDifference} ${
          hoursDifference === 1 ? "hour" : "hours"
        } ago`;
      } else {
        const daysDifference = Math.floor(hoursDifference / 24);
        return `${daysDifference} ${daysDifference === 1 ? "day" : "days"} ago`;
      }
    }
  }
  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/v1/videos/", {
            params: { query: searchQuery },
          });
        setSearchResults(response.data.data);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching search results:', error.message);
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  return (
    <div className="container mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Search Results for &quot;{searchQuery}&quot;</h1>
    {isLoading && <div className="text-gray-500">Loading...</div>}
    {!isLoading && searchResults.length === 0 && <div className="text-gray-500">No results found.</div>}
    {!isLoading && searchResults.length > 0 && (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {searchResults.map((video) => (
          <Link key={video._id} to={`/video/${video._id}`} className="hover:no-underline">
          <div key={video._id} className="border p-4 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105">
            <img src={video.thumbnail} alt={video.title} className="w-full h-36 object-cover mb-2 rounded-lg" />
           
            <div>
              <div className="flex flex-row items-center ">
                <img src={video.ownerInfo[0].avatar} alt={video.ownerInfo[0].name} className="w-8 h-8 object-cover rounded-full mr-2" />
                <span className="text-sm text-gray-500">{video.ownerInfo[0].username}</span>
              </div>
              <h2 className="text-lg font-semibold">{video.title}</h2>
            </div>
            <div className="flex flex-row items-center justify-between">
              <p className="text-sm text-gray-500">{video.views} views</p>
              <p className="text-sm text-gray-500"> {formatTimeDifference(video.createdAt)}</p>
            </div>
          </div>
        </Link>
        ))}
      </div>
    )}
  </div>
  );
}

export default SearchPage;
