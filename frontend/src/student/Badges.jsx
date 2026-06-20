import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

const BADGE_CONFIG = [
  { id: "FIRST_LESSON",    icon: "bi-play-circle-fill",    color: "bg-blue-100 text-blue-600",    label: "First Lesson",   desc: "Completed your very first lesson." },
  { id: "COURSE_COMPLETE", icon: "bi-trophy-fill",         color: "bg-yellow-100 text-yellow-600", label: "Course Complete", desc: "Finished an entire course." },
  { id: "STREAK_7",        icon: "bi-fire",                color: "bg-orange-100 text-orange-600", label: "7-Day Streak",   desc: "Learned every day for 7 days straight." },
  { id: "STREAK_30",       icon: "bi-stars",               color: "bg-purple-100 text-purple-600", label: "30-Day Streak",  desc: "Incredible 30-day learning streak!" },
  { id: "ENROLLED_5",      icon: "bi-collection-fill",     color: "bg-green-100 text-green-600",   label: "Eager Learner",  desc: "Enrolled in 5 or more courses." },
  { id: "REVIEWER",        icon: "bi-star-half",           color: "bg-pink-100 text-pink-600",     label: "Reviewer",       desc: "Left a course review." },
];

const StudentBadges = () => {
  const { user } = useAuth();
  const [earned, setEarned] = useState([]);
  const [streak, setStreak] = useState(0);
  const [leaderboard, setLeaderboard] = useState([]);
  const [tab, setTab] = useState("badges"); // "badges" | "leaderboard"
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;
      try {
        const [badgesRes, streakRes, leaderRes] = await Promise.allSettled([
          axiosInstance.get(`/api/v1/engagement/badges/${user.id}`),
          axiosInstance.get(`/api/v1/engagement/streak/${user.id}`),
          axiosInstance.get("/api/v1/engagement/leaderboard"),
        ]);

        if (badgesRes.status === "fulfilled") {
          const badgeData = badgesRes.value.data?.data || [];
          // backend returns list of BadgeResponseDto with badgeType field
          setEarned(badgeData.map(b => b.badgeType || b.type || b));
        }
        if (streakRes.status === "fulfilled") {
          setStreak(streakRes.value.data?.data?.currentStreak || 0);
        }
        if (leaderRes.status === "fulfilled") {
          setLeaderboard(leaderRes.value.data?.data || []);
        }
      } catch {
        setEarned([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const earnedCount = BADGE_CONFIG.filter(b => earned.includes(b.id)).length;

  return (
    <div className="min-h-screen bg-[#f3f9ff] pt-24 pb-16 px-[2%] lg:px-[12%] sm:px-[8%]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#222e48] sora-font">Achievements & Badges</h1>
        <p className="text-[#576070] mt-1">Milestones you've earned on your learning journey.</p>
      </div>

      {/* Streak Banner */}
      {!loading && (
        <div className="bg-gradient-to-r from-orange-500 to-yellow-400 text-white rounded-2xl p-6 mb-8 flex items-center gap-5 shadow-md">
          <div className="text-5xl">🔥</div>
          <div className="flex-1">
            <p className="font-bold text-2xl">{streak}-Day Streak</p>
            <p className="text-orange-100 text-sm">
              {streak > 0 ? "Keep it up! Consistency is the key to mastery." : "Start learning today to begin your streak!"}
            </p>
          </div>
          <div className="text-right">
            <p className="font-bold text-3xl">{earnedCount}/{BADGE_CONFIG.length}</p>
            <p className="text-orange-100 text-sm">Badges earned</p>
          </div>
        </div>
      )}

      {/* Tab Toggle */}
      <div className="flex gap-2 mb-6">
        <button onClick={() => setTab("badges")}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${tab === "badges" ? "bg-[#076dcd] text-white" : "bg-white text-[#576070] border border-[#ebecef] hover:bg-gray-50"}`}>
          <i className="bi bi-trophy me-2"></i>Badges
        </button>
        <button onClick={() => setTab("leaderboard")}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors cursor-pointer ${tab === "leaderboard" ? "bg-[#076dcd] text-white" : "bg-white text-[#576070] border border-[#ebecef] hover:bg-gray-50"}`}>
          <i className="bi bi-bar-chart-line me-2"></i>Leaderboard
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#076dcd] mx-auto"></div>
        </div>
      ) : tab === "badges" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BADGE_CONFIG.map(badge => {
            const isEarned = earned.includes(badge.id);
            return (
              <div key={badge.id} className={`bg-white rounded-2xl border p-6 flex items-start gap-4 transition-all shadow-sm ${isEarned ? "border-[#076dcd] shadow-blue-100" : "border-[#ebecef] opacity-60 grayscale"}`}>
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${isEarned ? badge.color : "bg-gray-100 text-gray-400"}`}>
                  <i className={`bi ${badge.icon} text-2xl`}></i>
                </div>
                <div>
                  <p className="font-bold text-[#222e48]">{badge.label}</p>
                  <p className="text-[#576070] text-xs mt-1">{badge.desc}</p>
                  {isEarned
                    ? <span className="inline-block mt-2 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-medium">✓ Earned</span>
                    : <span className="inline-block mt-2 bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full font-medium">Locked</span>
                  }
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Leaderboard Tab */
        <div className="bg-white rounded-2xl border border-[#ebecef] shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-[#ebecef]">
            <h2 className="font-bold text-[#222e48]">🏆 Top Learners</h2>
            <p className="text-xs text-[#576070] mt-0.5">Ranked by streak, completed courses, and badges</p>
          </div>
          {leaderboard.length === 0 ? (
            <div className="p-12 text-center text-[#576070]">
              <i className="bi bi-people text-5xl text-gray-200 block mb-3"></i>
              <p>No data yet. Start learning to appear here!</p>
            </div>
          ) : (
            <div className="divide-y divide-[#ebecef]">
              {leaderboard.map((entry, i) => {
                const isMe = entry.studentId === user?.id;
                const rankColors = ["text-yellow-500", "text-gray-400", "text-orange-400"];
                const rankIcons = ["🥇", "🥈", "🥉"];
                return (
                  <div key={entry.studentId || i}
                    className={`px-6 py-4 flex items-center gap-4 ${isMe ? "bg-blue-50" : "hover:bg-[#f7f8fa]"} transition-colors`}>
                    <div className={`text-2xl w-8 text-center font-bold ${rankColors[i] || "text-[#576070]"}`}>
                      {i < 3 ? rankIcons[i] : `#${entry.rank}`}
                    </div>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#076dcd] to-[#18a54a] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {(entry.studentName || "?")[0].toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-[#222e48]">
                        {entry.studentName || `Student #${entry.studentId}`}
                        {isMe && <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">You</span>}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5 text-xs text-[#576070]">
                        <span><i className="bi bi-fire text-orange-400 me-1"></i>{entry.currentStreak} day streak</span>
                        <span><i className="bi bi-collection-play text-[#076dcd] me-1"></i>{entry.totalCoursesCompleted} courses</span>
                        <span><i className="bi bi-trophy text-yellow-500 me-1"></i>{entry.totalBadges} badges</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentBadges;
