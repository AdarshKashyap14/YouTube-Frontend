import { Alert, Button } from "flowbite-react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  signInSuccess,
  signInStart,
  signInFailure,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function Signin() {
  const [username, setUsername] = useState("");

  const [password, setPassword] = useState("");
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!(username && password)) {
      dispatch(signInFailure("Please fill all the fields"));
      return;
    }
    try {
      dispatch(signInStart());
      const response = await axios.post("/api/v1/users/login", {
        username: username,
        password: password,
      });
      if (response.status != 200) {
        dispatch(signInFailure(response.message));
        return;
      } else {
        dispatch(signInSuccess(response.data));
        navigate("/");
      }
    } catch (err) {
      dispatch(signInFailure(err.message));
    }
  };

  return (
    <div className="min-h-screen mt-10">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Sign-In</h1>
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
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
              type="password"
              placeholder="Password"
              id="password"
              className="w-80 p-2 border rounded-md"
              onChange={(e) => {
                console.log(password);
                setPassword(e.target.value);
              }}
            />
            <Button
              type="submit"
              gradientDuoTone="purpleToPink"
              disabled={loading}
              outline
            >
              Sign In
            </Button>
          </form>
        )}

        <p className="mt-6">
          Don&apos;t have an account?{" "}
          <a href="/sign-up" className="text-blue-500">
            Signup
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
