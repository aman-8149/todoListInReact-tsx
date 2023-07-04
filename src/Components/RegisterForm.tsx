import React, { useCallback } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useMutation, useQuery } from "react-query";
import axios from "axios";
import Swal, { SweetAlertIcon } from "sweetalert2";
import { useNavigate } from "react-router-dom";

const signUpSchema = yup.object({
  username: yup
    .string()
    .email("Enter a valid email")
    .required("Username is Required"),
  password: yup
    .string()
    .required("Password is Required")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    ),
});

type setUserDataType = {
  username: string;
  password: string;
};

type fetchUserDataType = {
  id: number;
  username: string;
  password: string;
};

const RegisterForm = () => {
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

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(signUpSchema) });

  const { mutate: registerUser } = useMutation(
    (data: setUserDataType) =>
      axios.post("http://localhost/api/Login_Register.php", data),
    {
      onSuccess: () => {
        showAlert(
          "Registered Successfully",
          "success",
          "You have been Registered"
        );
        navigate("/");
      },
      onError: () => {
        showAlert("Something went Wrong", "error", "Internal Server Error");
      },
    }
  );

  const fetchUserData = async () => {
    const response = await axios.get("http://localhost/api/Login_Register.php");
    return response.data;
  };

  const { data: userData } = useQuery("userData", fetchUserData);

  const onSubmit = handleSubmit(async (inputData) => {
    let isUserAlreadyExist = false;
    userData.forEach((DataValue: fetchUserDataType) => {
      if (DataValue.username === inputData.username) {
        isUserAlreadyExist = true;
        return;
      }
    });

    if (isUserAlreadyExist) {
      showAlert("User Already Exist", "error", "This username already exist");
    } else {
      await registerUser(inputData);
    }
  });

  return (
    <>
      <section className="h-screen">
        <div className="h-full">
          <div className="g-6 flex h-full flex-wrap items-center justify-center lg:justify-between">
            <div className=" mb-12 md:mb-0 md:w-9/12 md:shrink-0 lg:w-6/12 xl:w-6/12">
              <img
                src="/images/register_logo.png"
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
                    Register
                  </button>
                  <p className="mb-0 mt-2 pt-1 text-sm font-semibold">
                    Already have an account? &nbsp;
                    <Link to="/" className="text-red-600">
                      Login
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

export default RegisterForm;
