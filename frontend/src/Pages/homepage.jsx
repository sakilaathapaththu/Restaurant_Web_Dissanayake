// src/Pages/Home.jsx
import React from "react";
import HomepageNavbar from "../Components/Navbar/Homepagenavbar";
import Homecarousel from "../Components/Home/Homecarousel";
import Aboutsection from "../Components/Home/Aboutsection";
import Featuredmanu from "../Components/Home/Featuredmanu";
import Highlights from "../Components/Home/Highlights";
import Simplecontact from "../Components/Home/Simplecontact";
import Footer from "../Components/Home/Footer";

export default function Home() {
  return (
    <>
      <HomepageNavbar />
      <div id="home">
        <Homecarousel />
      </div>
      <div id="highlights">
        <Highlights />
      </div>
      <div id="menu">
        <Featuredmanu />
      </div>
      <div id="about">
        <Aboutsection />
      </div>
      <div id="contact">
        {/* <Simplecontact /> */}
      </div>
      <Footer />
    </>
  );
}