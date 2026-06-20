import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faMessage, faUserCircle } from "@fortawesome/free-regular-svg-icons";

const posts = [
  { id: 1, tag: "Student Life", tagColor: "bg-[#f37638]", title: "The Importance of Diversity in Higher Education", author: "Pradip", date: "10 July, 25", comments: 25, excerpt: "Unlock the secrets to effective time management in the digital learning space and make the most of your studies.", img: "/Images/blog-image-01.jpg" },
  { id: 2, tag: "Freedom", tagColor: "bg-[#16a34a]", title: "How Online Learning is Changing the Future of Work", author: "Megha", date: "12 July, 25", comments: 18, excerpt: "Discover how remote and online education is reshaping career pathways across industries worldwide.", img: "/Images/blog-image-03.jpg" },
  { id: 3, tag: "Online", tagColor: "bg-[#17bbe4]", title: "Top 10 Skills Every Developer Should Learn in 2025", author: "Mihir", date: "18 July, 25", comments: 26, excerpt: "From AI to cloud computing, here are the skills that will define the tech landscape next year.", img: "/Images/blog-image-04.jpg" },
  { id: 4, tag: "Career", tagColor: "bg-[#8b5cf6]", title: "Building a Strong Portfolio as a Fresh Graduate", author: "Sneha", date: "22 July, 25", comments: 14, excerpt: "Practical tips for creating a standout portfolio that impresses recruiters and lands you your first job.", img: "/Images/blog-image-05.jpg" },
  { id: 5, tag: "Tips", tagColor: "bg-[#f37638]", title: "5 Habits of Highly Effective Lifelong Learners", author: "Arjun", date: "28 July, 25", comments: 33, excerpt: "Successful learners share common traits. Here is how to develop the habits that keep you growing.", img: "/Images/blog-image-06.jpg" },
  { id: 6, tag: "Design", tagColor: "bg-[#17bbe4]", title: "Why UI/UX Design Skills Are in High Demand", author: "Kavya", date: "01 Aug, 25", comments: 21, excerpt: "Businesses are investing more in user experience than ever before. Here is what that means for designers.", img: "/Images/blog-image-07.jpg" },
];

const Blog = () => {
  const [search, setSearch] = useState("");
  const filtered = posts.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.tag.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      {/* Page Header */}
      <div className="bg-[#f3f9ff] py-16 px-[4%] lg:px-[12%] text-center">
        <span className="text-[#076dcb] font-semibold sora-font text-sm">
          <i className="bi bi-journal-text pe-2"></i>Our Blog
        </span>
        <h1 className="text-[#222e48] text-3xl sm:text-5xl font-bold sora-font mt-2">
          Latest Articles & News
        </h1>
        <p className="text-[#576070] mt-3 text-sm max-w-xl mx-auto">
          Stay up to date with the latest in education, technology, and career growth.
        </p>
        <div className="flex items-center justify-center gap-2 mt-4 text-sm text-[#576070]">
          <Link to="/" className="hover:text-[#076dcd]">Home</Link>
          <i className="bi bi-chevron-right text-xs"></i>
          <span className="text-[#076dcd]">Blog</span>
        </div>
      </div>

      {/* Search */}
      <div className="px-[4%] lg:px-[12%] pt-12">
        <div className="relative max-w-md mx-auto">
          <i className="bi bi-search absolute left-4 top-1/2 -translate-y-1/2 text-[#a0aab8]"></i>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search articles..."
            className="w-full pl-10 pr-4 py-3 border border-[#ebecef] rounded-full text-sm outline-none focus:border-[#076dcd] transition-colors"
          />
        </div>
      </div>

      {/* Posts Grid */}
      <div className="px-[4%] lg:px-[12%] py-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {filtered.length > 0 ? filtered.map((post) => (
          <div key={post.id} className="bg-white rounded-2xl shadow-sm border border-[#ebecef] overflow-hidden group hover:shadow-md transition-shadow">
            <div className="h-52 overflow-hidden bg-gradient-to-br from-[#076dcd] to-[#18a54a]">
              <img
                src={post.img}
                alt={post.title}
                onError={(e) => { e.target.style.display = "none"; }}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="p-6">
              <span className={`${post.tagColor} text-white text-xs px-2 py-1 rounded chakrapetch-font font-semibold`}>{post.tag}</span>
              <h3 className="text-[#222e48] font-semibold sora-font text-lg mt-3 mb-2 group-hover:text-[#076dcd] transition-colors line-clamp-2">
                {post.title}
              </h3>
              <div className="flex flex-wrap gap-4 text-[#404a60] text-sm mb-3">
                <span><FontAwesomeIcon icon={faUserCircle} className="me-1" />{post.author}</span>
                <span><FontAwesomeIcon icon={faCalendar} className="me-1" />{post.date}</span>
                <span><FontAwesomeIcon icon={faMessage} className="me-1" />{post.comments}</span>
              </div>
              <p className="text-[#576070] text-sm line-clamp-2 mb-4">{post.excerpt}</p>
              <div className="border-t border-dashed border-[#ebecef] pt-4">
                <button className="text-[#076dcd] text-sm font-medium hover:gap-3 flex items-center gap-2 transition-all">
                  Read More <i className="bi bi-arrow-up-right"></i>
                </button>
              </div>
            </div>
          </div>
        )) : (
          <p className="col-span-full text-center text-[#576070] py-12">No articles found matching "{search}".</p>
        )}
      </div>
    </>
  );
};

export default Blog;
