import { useEffect, useState } from 'react';
import VideoCard from '../components/VideoCard';
import axios from 'axios';

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchVideos() {
      try {
        const response = await axios.get('https://backend-44vc.onrender.com/api/v1/videos/allvideos', {
          headers: {
            'Access-Control-Allow-Origin': 'https://you-tube-frontend.vercel.app'
            // Add any other headers as needed
          }
        });
        if (response.data && response.data.success) {
          setVideos(response.data.data);
          setIsLoading(false);
        
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
      {isLoading ? (
        <div className="text-center mt-8">Loading...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.length === 0 ? (
            <div className="text-center mt-8">No videos found.</div>
          ) : (
            videos.map((video) => (
              <VideoCard key={video._id} video={video} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
