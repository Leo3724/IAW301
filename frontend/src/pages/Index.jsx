import React, { useState, useEffect } from "react";
import { getPublishedCourses } from "../api/courses";
import { BsCheckAll } from "react-icons/bs";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faMessage, faUserCircle } from "@fortawesome/free-regular-svg-icons";

const Index = () => {
  
  const [courses, setCourses] = useState([]);
  const [apiLoading, setApiLoading] = useState(true);

  useEffect(() => {
    getPublishedCourses({ size: 6 })
      .then(res => setCourses(res.data.data?.content || []))
      .catch(() => setCourses([]))
      .finally(() => setApiLoading(false));
  }, []);

  return (
    <>
      {/* Hero */}
      <div className="hero flex justify-between items-center gap-10 px-[2%] lg:px-[12%] sm:px[8%] py-[50px] lg:py-[90px] h-screen relative">
        <div className="hero-content text-center mx-auto w-full flex flex-col items-center relative z-9">
          <span className="text-[#076dcb] font-semibold chakrapetch-font">
            <i className="bi bi-book pe-2"></i>
            Your Future, Achieve Success
          </span>
          <h2 className="text-[#222e48] text-3xl sm:text-5xl lg:text-7xl leading-14 lg:leading-20 font-bold sora-font py-2 w-full xl:w-[75%]">
            Find Your <span className="text-[#18a54a]">Ideal</span>Course, Build{" "}
            <span className="text-[#e58209]">Skills</span>
          </h2>

          <p className="text-[#576070] w-full lg:w-[60%] pb-4 text-sm sm:text-md">
            We are dedicated to nurturing young minds, empowering them with
            knowledge, skills, and confidance to excel.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link to="/signup"
              className="btn custom-btn bg-[#076dcb] hover:bg-black text-white px-5 py-3 rounded-full w-auto text-sm cursor-pointer transition-colors duration-300"
            >
              Get Start Today
              <i className="bi bi-arrow-up-right ps-2"></i>
            </Link>

            <Link to="/courses"
              className="btn custom-btn text-[#076dcb] border border-[#076dcb] hover:bg-[#076dcb] hover:text-white px-5 py-3 rounded-full w-auto text-sm cursor-pointer transition-colors duration-300"
            >
              Find Courses
              <i className="bi bi-arrow-up-right ps-2"></i>
            </Link>
          </div>
        </div>

        <img
          src={"/Images/element-01.png"}
          alt="shape-image"
          className="hero-shape1 absolute left-30 top-30 object-contain hidden md:block"
        />
        <img
          src={"/Images/element-02.png"}
          alt="shape-image"
          className="hero-shape2 absolute left-20 top-60 object-contain hidden md:block"
        />
        <img
          src={"/Images/element-03.png"}
          alt="shape-image"
          className="hero-shape3 absolute right-96 bottom-10 z-2 object-contain hidden lg:block"
        />
        <img
          src={"/Images/element-04.png"}
          alt="shape-image"
          className="hero-shape4 absolute right-40 bottom-50 z-2 object-contain hidden lg:block"
        />
        <img
          src={"/Images/element-05.png"}
          alt="shape-image"
          className="hero-shape5 absolute right-30 top-70 w-[20px] h-[20px] hidden sm:flex"
        />
        <img
          src={"/Images/element-05.png"}
          alt="shape-image"
          className="hero-shape5 absolute left-10 bottom-50 w-[25px] h-[25px] hidden sm:flex"
        />
        <img
          src={"/Images/element-06.png"}
          alt="shape-image"
          className="hero-shape6 absolute right-50 top-20 w-[25px] hidden lg:flex"
        />
      </div>
      {/* About */}
      <div className="about flex lg:flex-row flex-col justify-between items-center gap-10 px-[2%] lg:px-[12%] sm:px-[8%] py-[50px] lg:py-[90px] relative">
        <div className="about-content flex flex-col lg:w-1/2 w-full">
          <span className="text-[#076dcb] font-semibold sora-font pb-1">
            <i className="bi bi-book pe-2"></i>
            About LearnHub
          </span>
          <h2 className="text-[#222e48] text-3xl md:text-5xl md:leading-13 sora-font font-semibold">
            The Place Where You Can Achieve
          </h2>
          <p className="text-[#576070] pt-3 pb-8 text-sm sm:text-shadow-md">
            Welcome to LearnHub, where learning knows no bounds. Whether you're a
            student, professional, or lifelong learner — we're here to help you grow.
          </p>

          <ul className="flex flex-col gap-6 pb-10">
            <li className="flex gap-3 sm:flex-nowrap flex-wrap">
              <div className="bg-[#f3f9ff] rounded-[50%] min-w-[70px] min-h-[60px] flex justify-center p-4">
                <img
                  src={"/Images/about-img1.png"}
                  alt="about-image"
                  className="object-contain"
                />
              </div>
              <div>
                <h4 className="text-[#222e48] font-semibold text-xl sora-font">
                  Our Mission
                </h4>
                <p className="text-neutral-500 text-sm lg:text-md">
                  Driven by a team of dedicated educator, technologists, and
                  visionaries, we strive to create a supportive
                </p>
              </div>
            </li>
            <li className="flex gap-3 sm:flex-nowrap flex-wrap">
              <div className="bg-[#f3f9ff] rounded-[50%] min-w-[70px] min-h-[60px] flex justify-center p-4">
                <img
                  src={"/Images/about-img2.png"}
                  alt="about-image"
                  className="object-contain"
                />
              </div>
              <div>
                <h4 className="text-[#222e48] font-semibold text-xl sora-font">
                  Our Vision
                </h4>
                <p className="text-neutral-500 text-sm lg:text-md">
                  A Professional seeking to upskill, or a lifelong learner
                  exploring new horizons, we're here to accompany you every step
                  of the way.
                </p>
              </div>
            </li>
          </ul>

          <div className="border-t-2 border-dotted border-[#c1c4cc] pt-5 flex items-center gap-8">
            <button
              className="btn custom-btn bg-[#076dcd] hover:bg-black text-white px-5 py-3 rounded-full w-fit text-sm cursor-pointer transition-colors duration-300"
              type="submit"
            >
              Read More
              <i className="bi bi-arrow-up-right ps-2"></i>
            </button>

            <div className="about-user flex">
              <img src={"/Images/user.png"} className="w-10 h-10" alt="user-image" />
              <div className="ps-2">
                <span className="sora-font text-sm">LearnHub</span>
                <p className="text-[#576070] text-xs">Premier Learning Platform</p>
              </div>
            </div>
          </div>
        </div>
        <div className="about-image w-full lg:w-1/2 h-[550px] overflow-hidden group rounded-lg z-2">
          <img
            src={"/Images/about-image.jpg"}
            alt="about-user"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <img
          src={"/Images/element-01.png"}
          alt="shape-image"
          className="about-shape1 absolute left-10 top-30 object-contain sm:block hidden"
        />
        <img
          src={"/Images/element-06.png"}
          alt="shape-image"
          className="about-shape7 absolute right-10 bottom-10 object-contain lg:block hidden"
        />
        <img
          src={"/Images/element-05.png"}
          alt="shape-image"
          className="about-shape6 absolute left-10 bottom-50 w-[25px] h-[25px] sm:block hidden"
        />
        <img
          src={"/Images/element-05.png"}
          alt="shape-image"
          className="about-shape5 absolute right-30 top-70 w-[20px] h-[20px] sm:block hidden"
        />
      </div>
      {/* Features */}
      <div className="feature flex justify-center items-center flex-col gap-10 px-[2%] lg:px[12%] sm:px-[8%] py-[90px] lg:py-[120px] relative">
        <div className="feature-content z-2 flex flex-col text-center w-full lg:w-[60%] xl:w-[50%]">
          <h2 className="text-[#222e48] text-2xl sm:text-3xl md:text-4xl md:leading-10 sora-font font-semibold">
            Explore 5,000+ Free Online Courses For Students
          </h2>
          <p className="text-[#576070] pt-3 pb-8 text-sm sm:text-md">
            Welcome to our diverse and dynamic course catalog. We're dedicated
            to providing you with access to high-quality education.
          </p>
        </div>

        {/* Swiper Slider */}
        <Swiper
          slidesPerView={3}
          spaceBetween={20}
          loop={true}
          breakpoints={{
            1399: {
              slidesPerView: 3,
            },
            1199: {
              slidesPerView: 2.5,
            },
            767: {
              slidesPerView: 2,
            },
            0: {
              slidesPerView: 1,
            },
          }}
          className="feature-wrapper w-full"
        >
          <SwiperSlide>
            <div className="feature-item hover:bg-[#006dca] group flex justify-center items-start flex-col bg-white shadow-xl rounded-xl py-10 px-5 transition-all duration-300">
              <div className="feature-icon w-fit bg-white rounded-[50%] p-5">
                <img src={"/Images/feature-icon1.png"} alt="feature-icon" />
              </div>
              <div className="feature-info pt-8">
                <h4 className="text-[#222e48] sora-font pb-2 text-xl font-semibold group-hover:text-white">
                  Language Learning
                </h4>
                <p className="text-[#576070] text-sm group-hover:text-white">
                  Courses teaching languages such as English, Spanish, Bangla etc.
                </p>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="feature-item hover:bg-[#006dca] group flex justify-center items-start flex-col bg-white shadow-xl rounded-xl py-10 px-5 transition-all duration-300">
              <div className="feature-icon w-fit bg-white rounded-[50%] p-5">
                <img src={"/Images/feature-icon2.png"} alt="feature-icon" />
              </div>
              <div className="feature-info pt-8">
                <h4 className="text-[#222e48] sora-font pb-2 text-xl font-semibold group-hover:text-white">
                  Creative Arts & Design
                </h4>
                <p className="text-[#576070] text-sm group-hover:text-white">
                  Courses on graphic design, digital art, photography, video , audio etc...
                </p>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="feature-item hover:bg-[#006dca] group flex justify-center items-start flex-col bg-white shadow-xl rounded-xl py-10 px-5 transition-all duration-300">
              <div className="feature-icon w-fit bg-white rounded-[50%] p-5">
                <img src={"/Images/feature-icon3.png"} alt="feature-icon" />
              </div>
              <div className="feature-info pt-8">
                <h4 className="text-[#222e48] sora-font pb-2 text-xl font-semibold group-hover:text-white">
                  Health & Fitness
                </h4>
                <p className="text-[#576070] text-sm group-hover:text-white">
                  Courses On nutrition, fitness, traning, yoga, meditation, youga to sent...
                </p>
              </div>
            </div>
          </SwiperSlide>

          <SwiperSlide>
            <div className="feature-item hover:bg-[#006dca] group flex justify-center items-start flex-col bg-white shadow-xl rounded-xl py-10 px-5 transition-all duration-300">
              <div className="feature-icon w-fit bg-white rounded-[50%] p-5">
                <img src={"/Images/feature-icon3.png"} alt="feature-icon" />
              </div>
              <div className="feature-info pt-8">
                <h4 className="text-[#222e48] sora-font pb-2 text-xl font-semibold group-hover:text-white">
                  Health & Fitness
                </h4>
                <p className="text-[#576070] text-sm group-hover:text-white">
                  Courses On nutrition, fitness, traning, yoga, meditation...youga to sent...
                </p>
              </div>
            </div>
          </SwiperSlide>
        </Swiper>

        <img
          src={"/Images/element-03.png"}
          alt="shape"
          className="hero-shape3 absolute right-96 bottom-10 z-2 object-contain hidden lg:block"
        />
        <img
          src={"/Images/element-05.png"}
          alt="shape"
          className="hero-shape3 absolute right-30 top-70 w-[20px] h-[20px] object-contain hidden sm:flex"
        />
        <img
          src={"/Images/element-05.png"}
          alt="shape"
          className="hero-shape3 absolute left-10 bottom-50 w-[25px] h-[25px] object-contain hidden sm:flex"
        />
        <img
          src={"/Images/element-06.png"}
          alt="shape"
          className="hero-shape3 absolute right-70 top-20  object-contain hidden lg:flex"
        />
      </div>
      {/* Our Achivements */}
      <div className="our-achievements grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 xl:gap-8 px-[2%] lg:px[12%] sm:px-[90px] lg:py-[120px] relative">
        <div className="achievements-item z-2 h-[250px] flex justify-center items-center flex-col p-5 text-center w-full bg-[#fdf6f3] border border-[#ebecef] rounded-2xl">
          <div className="achievements-icon text-[#f37739] bg-white w-[70px] min-h-[70px] flex justify-center items-center rounded-[50%] mx-auto text-3xl p-1 mb-8 shadow-lg">
            <i className="bi bi-people"></i>
          </div>
          <div className="achievements-info">
            <h2 className="text-[#222e48] text-3xl font-bold sora-font uppercase">
              1.4K
            </h2>
            <span className="text-[#404a60] text-sm lg:text-md">
              Successfully Trained
            </span>
          </div>
        </div>

        <div className="achievements-item z-2 h-[250px] flex justify-center items-center flex-col p-5 text-center w-full bg-[#f1f6fd] border border-[#ebecef] rounded-2xl">
          <div className="achievements-icon text-[#006dca] bg-white w-[70px] min-h-[70px] flex justify-center items-center rounded-[50%] mx-auto text-3xl p-1 mb-8 shadow-lg">
            <i className="bi bi-camera-video"></i>
          </div>
          <div className="achievements-info">
            <h2 className="text-[#222e48] text-3xl font-bold sora-font uppercase">
              2K
            </h2>
            <span className="text-[#404a60] text-sm lg:text-md">
              Courses Completed
            </span>
          </div>
        </div>

        <div className="achievements-item z-2 h-[250px] flex justify-center items-center flex-col p-5 text-center w-full bg-[#fdf6f3] border border-[#ebecef] rounded-2xl">
          <div className="achievements-icon text-[#f37739] bg-white w-[70px] min-h-[70px] flex justify-center items-center rounded-[50%] mx-auto text-3xl p-1 mb-8 shadow-lg">
            <i className="bi bi-hand-thumbs-up"></i>
          </div>
          <div className="achievements-info">
            <h2 className="text-[#222e48] text-3xl font-bold sora-font uppercase">
              2.5K
            </h2>
            <span className="text-[#404a60] text-sm lg:text-md">
              Satisfaction Completed
            </span>
          </div>
        </div>

        <div className="achievements-item z-2 h-[250px] flex justify-center items-center flex-col p-5 text-center w-full bg-[#f1f6fd] border border-[#ebecef] rounded-2xl">
          <div className="achievements-icon text-[#006dca] bg-white w-[70px] min-h-[70px] flex justify-center items-center rounded-[50%] mx-auto text-3xl p-1 mb-8 shadow-lg">
            <i className="bi bi-person"></i>
          </div>
          <div className="achievements-info">
            <h2 className="text-[#222e48] text-3xl font-bold sora-font uppercase">
              5K
            </h2>
            <span className="text-[#404a60] text-sm lg:text-md">
              Students Community
            </span>
          </div>
        </div>
        <img
          src={"/Images/element-05.png"}
          alt="shape-image"
          className="element-5 hero-shape5 absolute right-30 top-70 w-[20px] h-[20px] hidden sm:flex"
        />
      </div>
      {/* Courses  */}
      <div className="courses px-[2%] lg:px-[12%] sm:px-[8%] py-[90px] lg:py-[150px] bg-[#f3f9ff] relative">
        <div className="flex justify-between items-center flex-col lg:flex-row w-full gap-3">
          <h2 className="text-[#222e48] text-2xl sm:text-3xl md:text-4xl font-medium lg:w-1/2">
            Explore Our Online Courses For Students
          </h2>
          <div className="lg:w-1/2 w-full">
            <p className="text-[#576070] text-sm pb-2">
              Welcome to our diverse and dynamic course catalog. High-quality education, accessible to everyone.
            </p>
            <Link to="/courses" className="bg-[#076dcd] hover:bg-black text-white px-5 py-3 rounded-full text-sm transition-colors duration-300 inline-block">
              See All Courses <i className="bi bi-arrow-up-right ps-2"></i>
            </Link>
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
          {apiLoading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white p-3 rounded-xl animate-pulse">
                <div className="h-[230px] rounded-xl bg-gray-200 mb-4"></div>
                <div className="p-3 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            ))
          ) : courses.length > 0 ? (
            courses.map((course) => (
              <Link to={`/courses/${course.id}`} key={course.id}
                className="bg-white p-3 rounded-xl group hover:shadow-lg transition duration-300 relative block"
              >
                <div className="h-[230px] rounded-xl overflow-hidden relative bg-gray-200">
                  {course.thumbnailUrl ? (
                    <img
                      src={course.thumbnailUrl}
                      alt={course.title}
                      loading="lazy"
                      className="group-hover:scale-110 transition duration-500 h-full w-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-[#076dcd] to-[#18a54a] flex items-center justify-center">
                      <i className="bi bi-play-circle text-white text-5xl opacity-50"></i>
                    </div>
                  )}
                  {course.level && (
                    <span className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-semibold ${
                      course.level === 'BEGINNER' ? 'bg-green-100 text-green-700' :
                      course.level === 'INTERMEDIATE' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-red-100 text-red-700'
                    }`}>{course.level}</span>
                  )}
                </div>
                <div className="p-3">
                  {course.category && (
                    <span className="text-xs text-[#076dcd] font-medium bg-blue-50 px-2 py-0.5 rounded-full">{course.category}</span>
                  )}
                  <h4 className="text-[#222e48] font-bold sm:text-lg hover:text-[#006dca] transition-colors duration-300 mt-2 line-clamp-2">
                    {course.title}
                  </h4>
                  <div className="flex justify-between items-center my-2 text-sm text-[#404a60]">
                    <span><i className="bi bi-camera-video pe-2"></i>{course.totalLessons ?? "—"} Lessons</span>
                    <span><i className="bi bi-star-fill text-yellow-400 pe-1"></i>{course.averageRating?.toFixed(1) ?? "N/A"}</span>
                  </div>
                  <div className="border-t-2 border-dotted pt-3 flex justify-between items-center">
                    <h4 className="text-[#f37739] text-xl font-semibold">
                      {course.price === 0 || !course.price ? "Free" : `₹${course.price}`}
                    </h4>
                    <span className="text-[#076dcd] font-medium text-sm">
                      View Course <i className="bi bi-arrow-up-right ps-1"></i>
                    </span>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600 py-10">
              No courses available yet. Check back soon!
            </p>
          )}
        </div>
        <img
          src={"/Images/element-01.png"}
          alt="shape-image"
          className="hero-shape1 absolute left-30 top-30 object-contain hidden lg:block"
        />
        <img
          src={"/Images/element-02.png"}
          alt="shape-image"
          className="hero-shape2 absolute left-20 top-60 object-contain hidden lg:block"
        />
        <img
          src={"/Images/element-03.png"}
          alt="shape-image"
          className="hero-shape3 absolute right-96 bottom-10 z-2 object-contain hidden lg:block"
        />
        <img
          src={"/Images/element-04.png"}
          alt="shape-image"
          className="hero-shape4 absolute right-40 bottom-50 z-2 object-contain hidden lg:block"
        />
        <img
          src={"/Images/element-05.png"}
          alt="shape-image"
          className="hero-shape5 absolute right-30 top-70 w-[25px] h-[25px] object-contain hidden sm:flex"
        />
        <img
          src={"/Images/element-05.png"}
          alt="shape-image"
          className="hero-shape6 absolute left-10 bottom-50 w-[25px] h-[25px] object-contain hidden sm:flex"
        />
        <img
          src={"/Images/element-06.png"}
          alt="shape-image"
          className="hero-shape7 absolute right-50 top-20 hidden lg:flex"
        />
      </div>
      {/* Why Choose Us */}
      <div className="why-choose-us flex lg:flex-row flex-col justify-between items-center gap-10 px-[2%] lg:px-[12%] sm:px-[8%] py-[50px] lg:py-[90px] relative">
        {/* Image (Left Side) */}
        <div className="why-choose-us-image w-full lg:w-1/2 h-[500px] overflow-hidden group rounded-lg">
          <img
            src={"/Images/why-choose-us-image.jpg"}
            alt="why-choose-us"
            className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
          />
        </div>

        {/* Content (Right Side) */}
        <div className="flex flex-col lg:w-1/2 w-full">
          <span className="text-[#076dcb] font-semibold sora-font pb-1">
            <i className="bi bi-book pe-2"></i>
            Why Choose Us
          </span>
          <h2 className="text-[#222e48] text-3xl md:text-4xl md:leading-13 sora-font font-semibold">
            Our Commitment to Excellence, Learn, Grow & Success.
          </h2>
          <p className="text-[#576070] pt-3 pb-8 text-sm">
            We are passionate about transforming lives through education.
            Founded with a vision to make learning accessible to all, we believe
            in the power of knowledge to...
          </p>

          <ul className="flex flex-col gap-6 pb-6">
            <li className="flex items-center gap-2 text-sm text-[#222e48]">
              <BsCheckAll className="size-7 text-[#076dcd]" />
              9/10 Average Satisfaction Rate
            </li>
            <li className="flex items-center gap-2 text-sm text-[#222e48]">
              <BsCheckAll className="size-7 text-[#076dcd]" />
              96% Completion Rate
            </li>
            <li className="flex items-center gap-2 text-sm text-[#222e48]">
              <BsCheckAll className="size-7 text-[#076dcd]" />
              Friendly Environment & Expert Teacher
            </li>
          </ul>

          <div className="border-t-2 border-dotted border-[#c1c4cc] pt-5 flex items-center gap-8">
            <button
              className="btn custom-btn bg-[#076dcd] hover:bg-black text-white px-5 py-3 rounded-full w-fit text-sm cursor-pointer transition-colors duration-300"
              type="submit"
            >
              Read More
              <i className="bi bi-arrow-up-right ps-2"></i>
            </button>
          </div>
        </div>

        {/* Shapes */}
        <img
          src={"/Images/element-02.png"}
          alt="shape-image"
          className="hero-shape-2 absolute left-20 top-60 object-contain md:block hidden "
        />
        <img
          src={"/Images/element-05.png"}
          alt="shape-image"
          className="hero-shape-5 absolute right-30 top-70 w-[20px] h-[20px] sm:flex hidden"
        />
        <img
          src={"/Images/element-05.png"}
          alt="shape-image"
          className="hero-shape-6 absolute left-10 bottom-50 w-[25px] h-[25px] sm:flex hidden"
        />
        <img
          src={"/Images/element-06.png"}
          alt="shape-image"
          className="hero-shape-7 absolute right-50 top-20 lg:flex hidden"
        />
      </div>
      {/* Articles */}
      <div className="articles bg-[#f3f9ff] px-[#2%] lg:px-[12%] sm:px-[8%] py-[50px] lg:py-[90px] relative gap-10 flex flex-col">
        <div className="articles-content flex flex-col lg:w-1/2 w-full mx-auto text-center z-2">
          <span className="text-[#076dcb] font-semibold sora-font pb-1">
            <i className="bi bi-book pe-2"></i>
            Articles
          </span>
          <h2 className="text-[#222e48] text-3xl md:text-3xl md:leading-10 sora-font font-semibold">Recent Articles</h2>
          <p className="text-[#576070] pt-3 pb-5 text-sm sm:text-md">
            Consectetur adipisicing elit, sed do eiusmod tempor inc idid unt ut labore et dolore magna aliqua enim ad...
          </p>
        </div>

        <div className="articles-wrapper grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 xl:gap-8 z-2">
          {/* cart-1 */}
          <div className="articles-item bg-white p-5 pb-3 rounded-xl group shadow-lg">
            <div className="articles-image w-full rounded-xl overflow-hidden">
              <img src={"/Images/articles-01.jpg"} alt="articles-image" className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" />
            </div>
            <div className="articles-content py-5">
              <span className="bg-[#f37638] text-white rounded-sm px-2 chakrapetch-font font-semibold py-1">Student life</span>
              <h4 className="my-3 sora-font font-semibold text-md sm:text-xl text-[#222e48] hover:text-[#006dca] transition-colors duration-500">
                The Importance of Diversity in Higher Education
              </h4>
              <div className="flex flex-wrap gap-3">
                <div className="text-[#404a60] text-md font-medium">
                  <FontAwesomeIcon icon={faUserCircle} className="pe-1"/>
                  <span>Pradip</span>
                </div>
                <div className="text-[#404a60] text-md font-medium">
                  <FontAwesomeIcon icon={faCalendar} className="pe-1"/>
                  <span>10 July, 25</span>
                </div>
                <div className="text-[#404a60] text-md font-medium">
                  <FontAwesomeIcon icon={faMessage} className="pe-1"/>
                  <span>25</span>
                </div>
              </div>
              <p className="text-sm py-2 text-[#404a60] pb-5">
                Unlock the secrets to effective time management in the digital learning space...
              </p>
              <div className="border-t-2 border-dotted border-[#c1c4cc] pt-5">
                <Link to='/blog'>
                <button className="btn custom-btn text-[#076dcd] font-medium rounded-full w-fit text-sm cursor-pointer" type="button">
                  Read More
                  <i className="bi bi-arrow-up-right ps-2"></i>
                </button>
                </Link>
              </div>
            </div>
          </div>
          {/* Cart-2 */}
          <div className="articles-item bg-white p-5 pb-3 rounded-xl group shadow-lg">
            <div className="articles-image w-full rounded-xl overflow-hidden">
              <img src={"/Images/articles-02.jpg"} alt="articles-image" className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" />
            </div>
            <div className="articles-content py-5">
              <span className="bg-[#16a34a] text-white rounded-sm px-2 chakrapetch-font font-semibold py-1">Freedom</span>
              <h4 className="my-3 sora-font font-semibold text-md sm:text-xl text-[#222e48] hover:text-[#006dca] transition-colors duration-500">
                The Importance of Diversity in Higher Education
              </h4>
              <div className="flex flex-wrap gap-3">
                <div className="text-[#404a60] text-md font-medium">
                  <FontAwesomeIcon icon={faUserCircle} className="pe-1"/>
                  <span>Megha</span>
                </div>
                <div className="text-[#404a60] text-md font-medium">
                  <FontAwesomeIcon icon={faCalendar} className="pe-1"/>
                  <span>12 July, 25</span>
                </div>
                <div className="text-[#404a60] text-md font-medium">
                  <FontAwesomeIcon icon={faMessage} className="pe-1"/>
                  <span>25</span>
                </div>
              </div>
              <p className="text-sm py-2 text-[#404a60] pb-5">
                Unlock the secrets to effective time management in the digital learning space...
              </p>
              <div className="border-t-2 border-dotted border-[#c1c4cc] pt-5">
                <Link to='/blog'>
                <button className="btn custom-btn text-[#076dcd] font-medium rounded-full w-fit text-sm cursor-pointer" type="button">
                  Read More
                  <i className="bi bi-arrow-up-right ps-2"></i>
                </button>
                </Link>
              </div>
            </div>
          </div>
          {/* cart-3 */}
          <div className="articles-item bg-white p-5 pb-3 rounded-xl group shadow-lg">
            <div className="articles-image w-full rounded-xl overflow-hidden">
              <img src={"/Images/articles-03.jpg"} alt="articles-image" className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110" />
            </div>
            <div className="articles-content py-5">
              <span className="bg-[#17bbe4] text-white rounded-sm px-2 chakrapetch-font font-semibold py-1">Online</span>
              <h4 className="my-3 sora-font font-semibold text-md sm:text-xl text-[#222e48] hover:text-[#006dca] transition-colors duration-500">
                The Importance of Diversity in Higher Education
              </h4>
              <div className="flex flex-wrap gap-3">
                <div className="text-[#404a60] text-md font-medium">
                  <FontAwesomeIcon icon={faUserCircle} className="pe-1"/>
                  <span>Mihir</span>
                </div>
                <div className="text-[#404a60] text-md font-medium">
                  <FontAwesomeIcon icon={faCalendar} className="pe-1"/>
                  <span>18 July, 25</span>
                </div>
                <div className="text-[#404a60] text-md font-medium">
                  <FontAwesomeIcon icon={faMessage} className="pe-1"/>
                  <span>26</span>
                </div>
              </div>
              <p className="text-sm py-2 text-[#404a60] pb-5">
                Unlock the secrets to effective time management in the digital learning space...
              </p>
              <div className="border-t-2 border-dotted border-[#c1c4cc] pt-5">
                <Link to='/blog'>
                <button className="btn custom-btn text-[#076dcd] font-medium rounded-full w-fit text-sm cursor-pointer" type="button">
                  Read More
                  <i className="bi bi-arrow-up-right ps-2"></i>
                </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <img src={"/Images/element-01.png"} alt="shape-image" className="hero-shape1 absolute left-30 top-30 object-contain hidden md:block"/>
        <img src={"/Images/element-02.png"} alt="shape-image" className="hero-shape2 absolute left-20 top-60 object-contain hidden md:block"/>
        <img src={"/Images/element-03.png"} alt="shape-image" className="hero-shape3 absolute right-96 bottom-10 z-1 object-contain hidden lg:block"/>
        <img src={"/Images/element-04.png"} alt="shape-image" className="hero-shape4 absolute right-40 bottom-50 z-0 object-contain hidden lg:block"/>
        <img src={"/Images/element-05.png"} alt="shape-image" className="hero-shape5 absolute right-30 top-70 w-[20px] h-[20px] hidden sm:flex"/>
        <img src={"/Images/element-05.png"} alt="shape-image" className="hero-shape5 absolute left-10 bottom-50 w-[25px] h-[25px] hidden sm:flex"/>
        <img src={"/Images/element-06.png"} alt="shape-image" className="hero-shape5 absolute right-50 top-20 z-2 hidden lg:flex"/>
      </div>
    </>
  );
};

export default Index;
