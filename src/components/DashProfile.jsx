import { useSelector, useDispatch } from "react-redux";
import { Button, TextInput } from "flowbite-react";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  updateStart,
  updateSuccess,
  updateFailure,
} from "../redux/user/userSlice";

export default function DashProfile() {
  const { currentuser } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);

  const filePickerRef = useRef();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log(file);
      setImageFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    if (imageFile) {
      console.log("uploading image");
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    dispatch(updateStart());
    const formData = new FormData();
    formData.append("avatar", imageFile);

    try {
      const res = await axios.patch(
        "/api/v1/users/update-user-avatar",
        formData
      );

      if (res.status === 200) {
        dispatch(updateSuccess(res.data));
        console.log(res.data);
      } else {
        dispatch(updateFailure(res.message));
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      console.log(error.message);
    }
  };

  return (
    <div
      className="max-w-lg mx-auto p-3 w-full flex flex-col"
    
    >
      <h1 className="my-7 text-center font-semibold text-3xl"   style={{
        backgroundImage: `url(${currentuser.data.user.coverImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}>Profile</h1>
      <form className="flex flex-col gap-4">
        <input
          type="file"
          id="avatar"
          onChange={handleImageChange}
          ref={filePickerRef}
          hidden
        />
        <div
          className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden rounded-full"
          onClick={() => filePickerRef.current.click()}
        >
          <img
            src={imageFileUrl || currentuser.data.user.avatar}
            alt="avatarImg"
            className="rounded-full w-full h-full object-cover border-8 border-{lightgray}"
          />
        </div>
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentuser.data.user.username}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentuser.data.user.email}
          //   onChange={handleChange}
        />
        <TextInput
          type="text"
          id="fullname"
          placeholder="fullname"
          defaultValue={currentuser.data.user.fullname}
          //   onChange={handleChange}
        />
        <Button type="submit" gradientDuoTone="purpleToBlue" outline>
          Update
        </Button>
      </form>
    </div>
  );
}
