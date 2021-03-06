import React, { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { signIn } from "next-auth/react";
import { BsGoogle } from "react-icons/bs";
import { FaFacebookF } from "react-icons/fa";
import { AiOutlineLoading } from "react-icons/ai";
import Link from "next/link";
import Layout from "../components/Layout";
import { useRouter } from "next/router";
import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
export default function Login() {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const status = await signIn("credentials", {
      redirect: false,
      email: e.target.email.value,
      password: e.target.password.value,
    });

    if (status.ok) {
      setLoading(false);
      toast.success("Login Sucessful");
      return setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    }
    setLoading(false);
    toast.error("Invalid login details", {
      position: "bottom-center",
      duration: 1000,
    });
    return;
  };
  const handleGoogleSignin = (e) => {
    e.preventDefault();
    signIn("google", { callbackUrl: "/dashboard" });
  };
  const handleFacebookSignin = (e) => {
    e.preventDefault();
    signIn("facebook", { callbackUrl: "/dashboard" });
  };
  return (
    <Layout>
      {/* <Header /> */}
      <div className="flex items-center min-h-full justify-center py-4  px-6 bg-slate-900">
        <div className="shadow-lg py-8 p-6 md:w-2/5 w-full bg-white rounded-md">
          <form onSubmit={onSubmit}>
            <fieldset
              disabled={loading}
              className="disabled:pointer-events-none"
            >
              <h3 className="text-center font-bold text-xl text-slate-500">
                Login
              </h3>

              <div className="mb-2">
                <label
                  htmlFor="password"
                  className='text-light after:content-["*"] after:text-red-900 after:font-bold after:ml-[2px]'
                >
                  Email
                </label>
                <input
                  type="Email"
                  placeholder="example@gmail.com"
                  className="w-full p-2 rounded border-slate-200 border border-solid"
                  id="email"
                  name="email"
                  required
                />
              </div>
              <div className="mb-2">
                <label
                  htmlFor="password"
                  className='text-light after:content-["*"] after:text-red-900 after:font-bold after:ml-[2px]'
                >
                  Password
                </label>
                <input
                  type="Password"
                  placeholder="Your Password"
                  className="w-full p-2 rounded border-slate-200 border border-solid"
                  id="password"
                  name="password"
                  required
                />
              </div>

              <button
                disabled={loading}
                className={`bg-primary flex w-full relative items-center justify-center p-2 text-white font-bold mt-3 rounded disabled:opacity-50`}
              >
                {loading && (
                  <AiOutlineLoading
                    size={30}
                    className="animate-spin mr-2 absolute left-10  "
                  />
                )}{" "}
                Login
              </button>
            </fieldset>
          </form>
          <div className="text-sm font-lignt my-3 cursor-pointer">
            Not registered?{" "}
            <Link href="/signup">
              <span className="text-blue-800">Sign Up Instead</span>
            </Link>
          </div>
          <p className="w-full my-2 text-slate-800 text-center flex items-center justify-between before:h-[1px] before:bg-black before:w-3/6 before:mr-1 after:h-[1px] after:bg-black after:w-3/6 after:ml-1">
            or
          </p>
          <button
            onClick={handleGoogleSignin}
            className=" bg-red-700 flex w-full items-center justify-center p-2 text-white font-bold rounded"
          >
            <BsGoogle />
            <span className="ml-2">Continue with Google</span>
          </button>
          <button
            onClick={handleFacebookSignin}
            className=" bg-blue-700 mt-2 flex w-full items-center justify-center p-2 text-white font-bold rounded"
          >
            <FaFacebookF />
            <span className="ml-2">Continue with Facebook</span>
          </button>
        </div>
        <Toaster />
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );
  if (session) {
    return {
      redirect: {
        destination: "/dashboard",
        permanent: false,
      },
    };
  }
  return { props: {} };
}
