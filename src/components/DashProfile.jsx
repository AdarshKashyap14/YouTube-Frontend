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
  const [fullname, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

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
  
  const handleUpdate = async (e) => {
    e.preventDefault(); 
    dispatch(updateStart());
    setLoading(true);

    try {
      const res = await axios.patch(
        "/api/v1/users//update-user-account",
        { fullname, email } // Send updated fullname and email
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
    } finally {
      setLoading(false); // Set loading state back to false
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
    setLoading(true);
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
    }finally {
      setLoading(false); // Set loading state back to false
    }
  };

  return (
    <div className="max-w-xl mx-auto p-3 w-full flex flex-col">
      <h1
        className="my-7 text-center font-semibold text-3xl"
        style={{
          backgroundImage: `url(${currentuser.data.user.coverImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        Profile
      </h1>
      <form className="flex flex-col gap-4" onSubmit={handleUpdate}>
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
            disabled={loading} 
          />
        </div>
        <TextInput
          type="text"
          id="username"
          placeholder="username"
          defaultValue={currentuser.data.user.username}
          disabled
        />
        <TextInput
          type="email"
          id="email"
          placeholder="email"
          defaultValue={currentuser.data.user.email}
          onChange={(e) => setEmail(e.target.value)} 
          
        />
        <TextInput
          type="text"
          id="fullname"
          placeholder="fullname"
          defaultValue={currentuser.data.user.fullname}
          onChange={(e) => setFullname(e.target.value)}
        />
       <Button type="submit" gradientDuoTone="purpleToBlue" outline disabled={loading}>
          {loading ? 'Updating...' : 'Update'}
        </Button>
      </form>
    </div>
  );
}
