import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, TextInput, Textarea, FileInput, Label } from "flowbite-react";

export default function UpdateVideo() {
    const { videoId } = useParams();
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
  
    // Function to handle form submission
    const handleSubmit = async (e) => {
      e.preventDefault();
        setIsLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("thumbnail", thumbnailFile);
      // Send the form data to the server
      try {
        const res = await axios.patch(`/api/v1/videos/${videoId}`, formData, {
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
      finally{
        setIsLoading(false); // Set loading state to false after request completes
      }
    };
  
    return (
      <div className="flex flex-col justify-center items-center gap-4">
        <h1 className="text-2xl flex items-center justify-center font-semibold mb-4">
          Update Video
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
           
            ></Textarea>
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
              Update Video
            </Button>
          )}
          </div>
        </form>
      </div>
    );
  }
  