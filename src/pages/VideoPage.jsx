import { BiLike } from "react-icons/bi";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button, TextInput } from "flowbite-react";
import { useSelector } from "react-redux";
import axios from "axios";

function VideoPage() {
  const { currentuser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [ownerDetails, setOwnerDetails] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [subscribed, setSubscribed] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleToggleLike = async () => {
    try {
      const responseLike = await axios.post(
        `/api/v1/likes/toggle/v/${videoId}`
      );
      if (responseLike.status === 200) {
        // Toggle the liked state
        setLiked((prevLiked) => !prevLiked);

      } else {
        console.error("Toggle like failed");
      }
    } catch (error) {
      console.error("Error toggling like:", error.message);
    }
  };

  function formatSubscribersCount(count) {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + "M";
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + "k";
    } else {
      return count.toString();
    }
  }
  //Add the code to fetch likes and toggle it onClick create the function
  const handleToggleSubscription = async () => {
    try {
      const responseSubscription = await axios.post(
        `/api/v1/subscriptions/c/${ownerDetails.owner._id}`
      );
      if (responseSubscription.status === 200) {
        // Toggle the subscription state
        setSubscribed((prevSubscribed) => !prevSubscribed);
      } else {
        console.error("Toggle subscription failed");
      }
    } catch (error) {
      console.error("Error toggling subscription:", error.message);
    }
  };

  // Function to handle adding comment
  const handleAddComment = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`/api/v1/comments/${videoId}`, {
        content: commentContent,
      });

      if (response.status === 201) {
        setCommentContent(""); // Clear the comment content input field
      }
    } catch (error) {
      console.error("Error adding comment:", error.message);
    } finally {
      setLoading(false);
      setCommentContent("");
    }
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch video details
        const videoResponse = await axios.get(`/api/v1/videos/${videoId}`);
        if (videoResponse.data && videoResponse.data.success) {
          setVideo(videoResponse.data.data);

          // Fetch owner details
          const ownerResponse = await axios.get(
            `/api/v1/subscriptions/u/${videoResponse.data.data.owner}`
          );
          if (ownerResponse.data && ownerResponse.data.success) {
            setOwnerDetails(ownerResponse.data.data);
            if (ownerResponse.data.data.isSubscribed) {
              setSubscribed(true);
            } else {
              setSubscribed(false);
            }
          } else {
            console.error(
              "Error fetching owner details:",
              ownerResponse.data.message
            );
          }

          // Fetch video likes
          const likesResponse = await axios.get(`/api/v1/likes/${videoId}`);
          await likesResponse.json;

          if (likesResponse.data && likesResponse.data.success) {
            setLikes(likesResponse.data.data.likes);

            if (likesResponse.data.data.isLikedByUser) {
              setLiked(true);
            } else {
              setLiked(false);
            }
          } else {
            console.error(
              "Error fetching video likes:",
              likesResponse.data.message
            );
          }

          // Fetch video comments
          const commentsResponse = await axios.get(
            `/api/v1/comments/${videoId}`
          );
          if (commentsResponse.data && commentsResponse.data.success) {
            setComments(commentsResponse.data.data);
            console.log("Comments:", commentsResponse.data);
          } else {
            console.error(
              "Error fetching video comments:",
              commentsResponse.data.message
            );
          }
        } else {
          console.error("Error fetching video:", videoResponse.data.message);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    }

    fetchData();
  }, [videoId, liked, subscribed, commentContent]);

  if (!currentuser) {
    navigate("/sign-in");
  }
  if (!video || !ownerDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-12 py-8">
      <div className="relative">
        <video controls className="w-full">
          <source src={video.videoFile} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <h1 className="text-3xl font-semibold mt-4">{video.title}</h1>

      <div className="flex items-center gap-4 mt-4">
        <div className="flex items-center gap-4">
          <img
            src={ownerDetails.owner.avatar}
            alt=""
            className="rounded-full h-12 w-12"
          />
          <div className="flex flex-col">
            <span>{ownerDetails.owner.username}</span>
            <span>
              {formatSubscribersCount(ownerDetails.subscribers.length)}
            </span>
          </div>
        </div>
        <Button
          size="xs"
          color={subscribed ? "success" : "dark"}
          pill
          onClick={handleToggleSubscription}
        >
          {subscribed ? "Subscribed" : "Subscribe"}
        </Button>

        <Button
          size="xs"
          color={liked ? "success" : "dark"}
          pill
          onClick={handleToggleLike}
        >
          <BiLike />
          {likes.length}
        </Button>
      </div>
      <p className="mt-8">{video.description}</p>

      {/* Add the div that shows the comments */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Comments</h2>
        <div className="flex items-center gap-4 mt-4">
          <img
            src={
              currentuser.data.user.avatar ||
              "https://randomuser.me/api/portraits/men/90.jpg"
            }
            alt=""
            className="rounded-full h-12 w-12"
          />
          <TextInput
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            type="text"
            placeholder="Add a comment..."
            required
            className="w-full  p-2"
            disabled={loading}
          />
          <Button
            size="xs"
            outline
            gradientDuoTone="tealToLime"
            onClick={handleAddComment}
            disabled={loading}
          >
            Add Comment
          </Button>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-semibold">Comments</h2>
          {comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment._id} className="flex items-center gap-4 mt-4">
                {/* Comment author avatar */}
                <img
                  src={comment.owner.avatar}
                  alt=""
                  className="rounded-full h-12 w-12"
                />

                <div className="flex flex-col">
                  <span className="font-medium">{comment.owner.username}</span>
                  <span className="text-sm">{comment.content}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default VideoPage;
