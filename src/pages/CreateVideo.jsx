import { Button, TextInput, Textarea, FileInput, Label } from "flowbite-react";
import { useState } from "react";
import { BASE_URL } from "../assets/constants";

import axios from "axios";

export default function CreateVideo() {
  // State variables for video upload form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnailFile);
    // Send the form data to the server
    try {
      const res = await axios.post(`${BASE_URL}/api/v1/videos/`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (res.status !== 200) {
        console.log(res.message);
      } else {
        console.log(res.data);
      }
    } catch (error) {
      console.log(error.message);
    }
    finally {
      setIsLoading(false); // Set loading state to false after request completes
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      <h1 className="text-2xl flex items-center justify-center font-semibold mb-4">
        Upload Video
      </h1>
      <form onSubmit={handleSubmit} className="items-center gap-4">
        <div>
          <Label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700"
          >
            Title
          </Label>
          <TextInput
            type="text"
            id="title"
            placeholder="Enter title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <Label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description
          </Label>
          <Textarea
            id="description"
            rows="4"
            placeholder="Enter description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></Textarea>
        </div>
        <div>
          <Label
            htmlFor="video"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Video
          </Label>
          <FileInput
            id="file"
            helperText="Please select the video you want to upload "
            required
            onChange={(e) => {
              setVideoFile(e.target.files[0]);
            }}
          />
        </div>
        <div>
          <Label
            htmlFor="thumbnail"
            className="block text-sm font-medium text-gray-700"
          >
            Upload Thumbnail
          </Label>
          <FileInput
            id="file"
            helperText="Please select the Thubnail for video "
            required
            onChange={(e) => {
              setThumbnailFile(e.target.files[0]);
            }}
          />
        </div>

        <div className="flex justify-center my-1">
        {isLoading ? (
            <Button
              type="button"
              gradientDuoTone="purpleToPink"
              outline
              className="w-full"
              disabled
            >
              Uploading...
            </Button>
          ) : (
            <Button
              type="submit"
              gradientDuoTone="purpleToPink"
              outline
              className="w-full"
            >
              Upload
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
