import { Alert, Button, TextInput } from "flowbite-react";
import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  signInSuccess,
  signInStart,
  signInFailure,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { BASE_URL } from "../assets/constants";


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
      const response = await axios.post(`${BASE_URL}/api/v1/users/login`, {
        username: username,
        password: password,
      });
      if (response.status != 200) {
        dispatch(signInFailure("Please check your credentials and try again"));
        return;
      } else {
        dispatch(signInSuccess(response.data));
        navigate("/");
      }
    } catch (err) {
      dispatch(signInFailure("Please check your credentials and try again"));
    }
  };

  return (
    <div className="min-h-screen mt-10">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">Sign-In</h1>
        {error && (
          <Alert color="red" className="mt-4 mb-4">
            {error}
          </Alert>
        )}
        {loading ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : (
          <form className="flex flex-col gap-4 md:w-3/4 lg:w-1/4 mx-auto" onSubmit={handleSubmit}>
            <TextInput
         
              type="text"
              placeholder="UserName"
              id="username"
              required
              onChange={(e) => {
                setUsername(e.target.value);
                console.log(username);
              }}
            />

            <TextInput
              type="password"
              placeholder="Password"
              id="password"
             
              required
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
          <Link to="/sign-up" className="text-blue-500">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
