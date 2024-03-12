import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';


function VideoCard({ video }) {

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
VideoCard.propTypes = {
   video: PropTypes.object.isRequired,
};

  return (
    <Link to={`/video/${video._id}`}>
    <div className="p-4 rounded-lg  relative overflow-hidden">
      <video
        className="w-full h-auto"
        src={video.videoFile}
        controls
        // autoPlay
      />
      <div className="mt-3 flex flex-row items-center justify-start">
        <div className="mr-2">
          <img
            src={video.owner.avatar}
            alt={video.owner.username}
            className="w-14 h-14 rounded-full"
          />
        </div>
        <div className="flex flex-col items-start mt-1">
          <p className="text-gray-800 font-semibold line-clamp-1 dark:text-white">
            {video.title}
          </p>
          <div className="flex flex-col mt-1">
            <p className="text-gray-600 text-sm dark:text-white">
              {video.owner.username}
            </p>
         
          <p className="text-gray-600 text-sm dark:text-white">
             {video.views} views •{" "}
            {formatTimeDifference(video.createdAt)}
          </p>
        </div>
          </div>

       
      </div>
    </div>
    </Link>
  );
}

export default VideoCard;
