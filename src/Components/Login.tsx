import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";
import { useQuery } from "react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal, { SweetAlertIcon } from "sweetalert2";

const schemaObject = yup.object({
  username: yup
    .string()
    .email("Enter a Valid Email")
    .required("Username is Required"),
  password: yup
    .string()
    .required("Password is Required")
    .min(6, "password should be minimum 6 characters"),
});

type setUserDataType = {
  id: number;
  username: string;
  password: string;
};

const Login: React.FC = () => {
  const navigate = useNavigate();

  const isUserAlreadyLoggedIn = window.localStorage.getItem("userLoggedIn");
  if (isUserAlreadyLoggedIn !== null && isUserAlreadyLoggedIn !== "") {
    navigate("/list");
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schemaObject) });

  const fetchUserData = async () => {
    const response = await axios.get("http://localhost/api/Login_Register.php");
    return response.data;
  };

  const showAlert = useCallback(
    (title: string, type: SweetAlertIcon, message: string) => {
      Swal.fire({
        title: title,
        text: message,
        icon: type,
        confirmButtonText: "Okay",
      });
    },
    []
  );

  const { data } = useQuery("getUserData", fetchUserData);

  const onSubmit = handleSubmit((inputData) => {
    let isLoggedIn = false;
    if (data) {
      data.forEach((data: setUserDataType) => {
        if (
          data.username === inputData.username &&
          data.password === inputData.password
        ) {
          isLoggedIn = true;
          return;
        }
      });
    }

    if (isLoggedIn) {
      window.localStorage.setItem("userLoggedIn", inputData.username);
      navigate("/list");
    } else {
      showAlert(
        "Invalid User",
        "error",
        "Please Enter correct Username or Password"
      );
      navigate("/");
    }
  });

  return (
    <>
      <section className="h-screen">
        <div className="h-full">
          <div className="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between">
            <div className=" mb-12 md:mb-0 md:w-9/12 md:shrink-0 lg:w-6/12 xl:w-6/12">
              <img
                src="/images/Login_logo.webp"
                className="w-full"
                alt="Login page"
              />
            </div>

            <div className="mb-12 md:mb-0 md:w-8/12 lg:w-5/12 xl:w-5/12">
              <form onSubmit={onSubmit}>
                <div className="relative mb-3" data-te-input-wrapper-init>
                  <label className="font-lg font-medium" htmlFor="username">
                    Email Address
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full lg:w-96 p-2.5"
                    placeholder="Email Address"
                    {...register("username", { required: true })}
                  />

                  {errors.username && (
                    <span className="text-red-600">
                      {errors.username.message}
                    </span>
                  )}
                </div>

                <div className="relative mb-6" data-te-input-wrapper-init>
                  <label className="text-lg font-medium" htmlFor="password">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full lg:w-96 p-2.5"
                    placeholder="Password"
                    {...register("password", { required: true })}
                  />
                  {errors.password && (
                    <span className="text-red-600">
                      {errors.password.message}
                    </span>
                  )}
                </div>

                <div className="text-center lg:text-left">
                  <button
                    type="submit"
                    className=" rounded bg-primary px-7 pb-2.5 pt-3 text-sm font-medium uppercase text-black shadow-[0_4px_9px_-4px_#3b71ca] "
                    data-te-ripple-init
                    data-te-ripple-color="dark"
                  >
                    Login
                  </button>

                  <p className="mb-0 mt-2 pt-1 text-sm font-semibold">
                    Don't have an account? &nbsp;
                    <Link to="/Register" className="text-red-600 transition">
                      Register
                    </Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
