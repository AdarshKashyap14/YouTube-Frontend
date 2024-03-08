import { useEffect, useState } from 'react';
import VideoCard from '../components/VideoCard';
import axios from 'axios';

export default function Home() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await axios.get('/api/v1/videos/allvideos');
        if (response.data && response.data.success) {
          setVideos(response.data.data);
          console.log(response.data.data);
        } else {
          console.error('Error fetching videos:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching videos:', error);
      }
    }

    fetchVideos();
  }, []);

  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
}
