import React from "react";
import { Link } from "react-router-dom";
import RegisterForm from "../components/auth/RegisterForm";
import logo from "../assets/react.svg";

const Register: React.FC = () => {
  return (
    <div className="min-h-screen bg-amber-50/60 flex items-center justify-center px-4 py-16">
      <div className="relative w-full max-w-5xl">
        <div className="absolute -left-24 top-10 h-52 w-52 rounded-full bg-amber-200/40 blur-3xl" />
        <div className="absolute right-0 top-16 h-56 w-56 rounded-full bg-emerald-200/30 blur-3xl" />

        <div className="relative grid gap-8 rounded-3xl border border-white/60 bg-white/80 p-8 shadow-2xl backdrop-blur lg:grid-cols-[1.1fr_1fr]">
          <div className="flex flex-col justify-center space-y-6">
            <img className="h-12 w-12" src={logo} alt="Store Logo" />
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-amber-700 font-semibold">
                Craft a new account
              </p>
              <h1 className="mt-4 text-3xl font-semibold text-gray-900">
                Join the WoodCraft makers
              </h1>
              <p className="mt-3 text-sm text-gray-600">
                Create your profile, track custom orders, and save your favorite pieces.
              </p>
            </div>
            <div className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-amber-700 hover:text-amber-800">
                Sign in
              </Link>
            </div>
          </div>

          <div className="rounded-2xl bg-white px-6 py-8 shadow-lg">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;

