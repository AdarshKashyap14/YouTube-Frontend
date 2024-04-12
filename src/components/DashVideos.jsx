import { useState, useEffect } from "react";
import { Button } from "flowbite-react";
import axios from "axios";
import {  useNavigate } from "react-router-dom";
import { BASE_URL } from "../assets/constants";


export default function DashVideos() {
  // console.log(currentuser.data.user.username);
  const [userVideos, setUserVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const navigate = useNavigate();
  const deleteVideo = async (videoId) => {
    try {
      setIsLoading(true);
      // Make an authenticated request to delete the video
      const response = await axios.delete(`${BASE_URL}/api/v1/videos/${videoId}`);
      console.log(response.data);
   
      setRefresh(true);
      setIsLoading(false);
       
    } catch (error) {
      console.error("Error deleting video:", error);
      setIsLoading(false);
    }
  };

  const togglePublish = async (videoId) =>{
    try {
      setIsLoading(true);
   
      const response = await axios.patch(`${BASE_URL}/api/v1/videos/toggle/publish/${videoId}`);
      console.log(response.data);
      setRefresh(true);
      setIsLoading(false);
    } catch (error) {
      console.error("Error publishing video:", error);
      setIsLoading(false);
    }
  
  }

  
  const handleUpdateVideo = (videoId) => {
   
   navigate(`/update-video/${videoId}`);
  };

  useEffect(() => {
    const fetchUserVideos = async () => {
      try {
        setIsLoading(true);
        // Make an authenticated request to fetch user's videos
        const response = await axios.get(`${BASE_URL}/api/v1/videos/allvideos/user`);

        setUserVideos(response.data.data); 
        console.log(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching user videos:", error);
        setIsLoading(false);
      }
    };

    fetchUserVideos();
  }, [refresh]);

  return (
    <div className="max-w-xl mx-auto p-3 w-full flex flex-col">
      {isLoading && <div>Loading...</div>}
      {!isLoading && userVideos.length === 0 && <div>No videos found.</div>}
      {!isLoading && userVideos.length > 0 && (
        <div>
          <h1 className="text-2xl font-bold mb-4">Your Videos</h1>
          <div className="flex flex-col gap-4">
            {userVideos.map((video) => (
              <div
                key={video._id}
                className="border border-gray-200 rounded-lg p-4 shadow-md flex items-center"
              >
                {/* Left side with thumbnail */}
                <div className="flex-shrink-0">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-36 h-36 object-cover rounded-lg"
                  />
                </div>

                {/* Right side with description */}
                <div className="ml-4 flex-grow">
                  <h2 className="text-lg font-semibold">{video.title}</h2>
                  <p className="text-gray-600">{video.description}</p>
                  {/* Buttons for update and delete */}
                  <div className="mt-2 flex flex-row items-center justify-between">
                    <Button
                      outline
                      gradientDuoTone="cyanToBlue"
                      pill
                      title="Update this video"
                      onClick={() => handleUpdateVideo(video._id)} 
                    >
                      Update
                    </Button>
                    {video.isPublished ? (
                      <Button
                        color="success"
                        pill
                        title="This video is published"
                        onClick={() => togglePublish(video._id)}
                      >
                        Published
                      </Button>
                    ) : (
                      <Button
                        color="failure"
                        pill
                        title="This video is not published"
                        onClick={() => togglePublish(video._id)}
                      >
                        Not Published
                      </Button>
                    )}
                    <Button
                      outline
                      color="failure"
                      pill
                      title="Delete this video"
                      onClick={() => deleteVideo(video._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
