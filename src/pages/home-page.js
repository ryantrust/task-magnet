import React from "react";
import heroImage from "../assets/hero.png";
import LoginButton from "../components/loginButton";
import LogoutButton from "../components/logoutButton";
import SignupButton from "../components/signupButton";
export default () => (
  <body>
    <nav id="header" className="w-full z-30 top-0 text-black mr-5">
      <div className="w-full container mx-auto flex flex-wrap items-center justify-between mt-0 py-2">
        <div className=" pl-4 flex items-center">
          <a
            className="toggleColour text-black no-underline hover:no-underline font-bold text-2xl lg:text-4xl"
            href="#"
          >
            TaskMagnet
          </a>
        </div>
        <div
          className="w-full flex-grow lg:flex lg:items-center lg:w-auto hidden mt-2 lg:mt-0 bg-white lg:bg-transparent text-black p-4 lg:p-0 z-20"
          id="nav-content"
        >
          <ul className="list-reset lg:flex justify-end flex-1 items-center">
            <li className="mr-3">
              <p className="pr-5 text-black">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                The best productivity platform for college students.
              </p>
            </li>
            <li className="mr-3"></li>
            <li className="mr-3"></li>
          </ul>
        </div>
      </div>
      <hr className="border-b border-gray-100 opacity-25 my-0 py-0" />
    </nav>
    <div className="pt-24">
      <div className="container px-3 mx-auto flex flex-wrap items-center">
        <div className="w-full md:w-2/5 flex justify-center items-start text-center md:text-left mb-5 md:mb-0">
          <div>
            <p className="uppercase tracking-loose w-full">Born at UCLA</p>
            <h1 className="my-4 text-5xl font-bold leading-tight">
              Tired of tabbing between Google Calendar, notes, and an alarm to
              keep yourself organized?
            </h1>
            <p className="leading-normal text-2xl mb-2">
              You won't have to for long. Join TaskMagnet today.
            </p>
            <div className="md:justify-start flex justify-center">
              <SignupButton />
              <LoginButton />
            </div>
          </div>
        </div>
        <div className="w-full md:w-3/5 py-6 text-center">
          <img className="w-auto md:w-4/5 z-50" src={heroImage} alt="Hero" />
        </div>
      </div>
    </div>
  </body>
);
