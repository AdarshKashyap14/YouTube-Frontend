import { Alert, Avatar, Button } from "flowbite-react";
import { useState } from "react";
import axios from "axios";
// import { navigate } from "react-router-dom";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [coverImage, setCoverImage] = useState(null);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    if (
      !username ||
      !email ||
      !fullName ||
      !password ||
      !avatar ||
      !coverImage
    ) {
      setError("Please fill all the fields");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("username", username);
      formDataToSend.append("email", email);
      formDataToSend.append("password", password);
      formDataToSend.append("fullName", fullName);
      formDataToSend.append("avatar", avatar);
      formDataToSend.append("coverImage", coverImage);

      const response = await axios.post(
        "/api/v1/users/register",
        formDataToSend
      );

      const data = await response.json;

      if (!response.ok) {
        setError(response.message);
        return;
      }
      if (response.ok) {
        setLoading(false);
        // navigate("/signin");
      }
      console.log(data);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen mt-10">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Sign-Up</h1>
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center gap-2">
              <Avatar
                img="/images/people/profile-picture-5.jpg"
                alt="avatar of Jese"
                rounded
                bordered
              />
              <label
                htmlFor="profile"
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-2 rounded-md cursor-pointer"
              >
                Upload Profile
              </label>
              <input
                type="file"
                id="avatar"
                onChange={(e) => {
                  setAvatar(e.target.files[0]);
                  console.log(avatar);
                }}
              />
            </div>

            <div className="flex flex-col items-center gap-2">
              <label
                htmlFor="cover"
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-2 rounded-md cursor-pointer"
              >
                Cover Photo
              </label>
              <input
                type="file"
                id="coverImage"
                onChange={(e) => {
                  setCoverImage(e.target.files[0]);
                  console.log(coverImage);
                }}
              />
            </div>

            <input
              type="text"
              placeholder="Full Name"
              id="fullname"
              className="w-80 p-2 border rounded-md"
              onChange={(e) => {
                setFullName(e.target.value);
                console.log(fullName);
              }}
            />
            <input
              type="text"
              placeholder="UserName"
              id="username"
              className="w-80 p-2 border rounded-md"
              onChange={(e) => {
                setUsername(e.target.value);
                console.log(username);
              }}
            />
            <input
              type="email"
              placeholder="Email"
            
              id="email"
              className="w-80 p-2 border rounded-md"
              onChange={(e) => {
                setEmail(e.target.value);
                console.log(email);
              }}
            />
            <input
              type="password"
              placeholder="Password"
            
              id="password"
              className="w-80 p-2 border rounded-md"
              onChange={(e) => {
                setPassword(e.target.value);
                console.log(password);
              }}
            />
            <Button
              type="submit"
              gradientDuoTone="purpleToPink"
              disabled={loading}
              outline
            >
              Sign Up
            </Button>
          </form>
        )}

        <p className="mt-6">
          Already have an account?{" "}
          <a href="/sign-in" className="text-blue-500">
            Signin
          </a>
        </p>
      </div>
      {error && (
        <Alert color="red" className="mt-4">
          {error}
        </Alert>
      )}
    </div>
  );
}
