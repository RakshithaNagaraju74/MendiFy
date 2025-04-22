import React, { useState, useEffect } from "react";

const videos = [
  { title: "10 Minute Guided Meditation", url: "https://www.youtube.com/embed/inpok4MKVLM", category: "Stress" },
  { title: "Peaceful Relaxation Music", url: "https://www.youtube.com/embed/2OEL4P1Rz04", category: "Sleep" },
  { title: "Mindfulness Meditation for Stress Relief", url: "https://www.youtube.com/embed/w6T02g5hnT4", category: "Stress" },
  { title: "Deep Breathing for Anxiety", url: "https://www.youtube.com/embed/MIr3RsUWrdo", category: "Stress" },
  { title: "Healing Sleep Meditation", url: "https://www.youtube.com/embed/ZToicYcHIOU", category: "Sleep" },
  { title: "Letting Go Guided Meditation", url: "https://www.youtube.com/embed/ihwcw_ofuME", category: "Affirmations" },
  { title: "Self Love Affirmations", url: "https://www.youtube.com/embed/CjVQJdIrDJ0", category: "Affirmations" },
  { title: "Nature Sounds Meditation", url: "https://www.youtube.com/embed/LFgR1S1isVo", category: "Sleep" },
  { title: "Morning Affirmations", url: "https://www.youtube.com/embed/lE13L3eNxOQ", category: "Affirmations" },
  { title: "Deep Sleep Music", url: "https://www.youtube.com/embed/4B4bhw_gF4A", category: "Sleep" },
  { title: "Stress Relief Yoga", url: "https://www.youtube.com/embed/v7AYKMP6rOE", category: "Stress" },
  { title: "Sleep Meditation Music", url: "https://www.youtube.com/embed/7au93Tke6-0", category: "Sleep" },
  { title: "Guided Meditation for Kids", url: "https://www.youtube.com/embed/Qd-YrbZifhs", category: "Stress" },
  { title: "Stress Relief Guided Meditation", url: "https://www.youtube.com/embed/U2dyDfc0On4", category: "Stress" },
  { title: "Gratitude Meditation", url: "https://www.youtube.com/embed/-L5JHTEZIfk", category: "Affirmations" },
  { title: "Deep Breathing Meditation for Relaxation", url: "https://www.youtube.com/embed/DKChQEKceDo", category: "Stress" },
  { title: "Positive Affirmations for Teens", url: "https://www.youtube.com/embed/44tED3Zl7lQ", category: "Affirmations" },
  { title: "Deep Sleep Meditation Music", url: "https://www.youtube.com/embed/0ZJhTi7LqH4", category: "Sleep" },
  { title: "Positive Energy Meditation", url: "https://www.youtube.com/embed/TBf2_EpPlwo", category: "Inspiration" },
  { title: "Manifesting Your Dreams", url: "https://www.youtube.com/embed/4sFgC4Dl8iI", category: "Inspiration" },
  { title: "Guided Relaxation for Sleep", url: "https://www.youtube.com/embed/m6dJ4CFO6kA", category: "Sleep" },
  { title: "Stress Management Affirmations", url: "https://www.youtube.com/embed/V47KfwJ2w8Y", category: "Affirmations" },
  { title: "Inspirational Guided Meditation", url: "https://www.youtube.com/embed/3uwNlmBhh7g", category: "Inspiration" },
  { title: "Calming Music for Meditation", url: "https://www.youtube.com/embed/8JPgnrSAAaI", category: "Sleep" },
  { title: "Motivational Meditation", url: "https://www.youtube.com/embed/FhPO3FqHC7I", category: "Inspiration" },
  { title: "Relaxing Rain Sounds", url: "https://www.youtube.com/embed/F0jP5mf2so4", category: "Sleep" },
  { title: "Anxiety Relief Breathing Exercise", url: "https://www.youtube.com/embed/MtEqxdLF9PQ", category: "Stress" },
  { title: "Guided Sleep Meditation", url: "https://www.youtube.com/embed/oeJXc8nly9Y", category: "Sleep" },
  { title: "How to Deal with Anxiety", url: "https://www.youtube.com/embed/SNBjoR2EXtM", category: "Stress" },
  { title: "Self-Compassion Meditation", url: "https://www.youtube.com/embed/jfJvD2-FnOE", category: "Affirmations" },
  { title: "Awakening Your Inner Strength", url: "https://www.youtube.com/embed/Z7MBXyMwT5g", category: "Inspiration" },
  { title: "Healing Anxiety with Guided Meditation", url: "https://www.youtube.com/embed/YN6K33Y8HUk", category: "Stress" },
  { title: "Forgiveness Meditation", url: "https://www.youtube.com/embed/f6aLOeJzPto", category: "Affirmations" },
  { title: "Healing Nature Sounds", url: "https://www.youtube.com/embed/n7GXTc0hctA", category: "Sleep" },
  { title: "Inner Peace Affirmations", url: "https://www.youtube.com/embed/QVHRdyLfHEg", category: "Affirmations" },
  { title: "Positive Thoughts for Teens", url: "https://www.youtube.com/embed/P6T7E9Qnlpo", category: "Affirmations" },
  { title: "Rain and Thunder Relaxation", url: "https://www.youtube.com/embed/FgVKYjNXT0g", category: "Sleep" },
  { title: "Love and Healing Meditation", url: "https://www.youtube.com/embed/JHcfZnOwwIg", category: "Affirmations" },
  { title: "Healing Meditation Music", url: "https://www.youtube.com/embed/kcQo2wDQ5JQ", category: "Sleep" },
  { title: "Guided Deep Sleep Meditation", url: "https://www.youtube.com/embed/J9fLlsosA8E", category: "Sleep" },
  { title: "Motivation for Teens", url: "https://www.youtube.com/embed/1eay_gfgtfo", category: "Inspiration" },
  { title: "Meditation for Stress Relief", url: "https://www.youtube.com/embed/0wz8i3XrJmE", category: "Stress" },
  { title: "Awaken Your Inner Power", url: "https://www.youtube.com/embed/M12M0cAoxhA", category: "Inspiration" },
  { title: "Guided Meditation for Teens", url: "https://www.youtube.com/embed/Z9o91m4SM8Q", category: "Stress" },
  { title: "Affirmations for Positivity", url: "https://www.youtube.com/embed/TVxlPAODcmE", category: "Affirmations" },
  { title: "Sleep Meditation Music for Teens", url: "https://www.youtube.com/embed/8PxX9I-w8k8", category: "Sleep" },
  { title: "Guided Meditation for Focus", url: "https://www.youtube.com/embed/Fp8-r_l9LkA", category: "Stress" },
  { title: "Stress Relief Mindfulness Meditation", url: "https://www.youtube.com/embed/hHGgLrdqzWw", category: "Stress" },
  { title: "Meditation for Inner Peace", url: "https://www.youtube.com/embed/Qox0f8zz38Y", category: "Stress" },
  { title: "Affirmations for Calm", url: "https://www.youtube.com/embed/96tD2sOpXw4", category: "Affirmations" },
  { title: "Healing Sounds Meditation", url: "https://www.youtube.com/embed/0D6kQoJ7uL4", category: "Sleep" },
  { title: "Sleep & Relaxation Music", url: "https://www.youtube.com/embed/5Q2e_ug5gHg", category: "Sleep" },
];

export default function MeditationPage() {
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const music = document.getElementById("bgMusic") as HTMLAudioElement | null;
    if (music) {
      music.volume = 0;
      music.play().catch(() => {});
      let volume = 0;
      const fade = setInterval(() => {
        if (volume < 0.3) {
          volume += 0.01;
          music.volume = volume;
        } else {
          clearInterval(fade);
        }
      }, 200);
    }
  }, []);

  const filteredVideos =
    filter === "All" ? videos : videos.filter((v) => v.category === filter);

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100 py-10 px-4 text-gray-800 overflow-hidden">
      <video
        autoPlay
        muted
        loop
        className="fixed top-0 left-0 w-full h-full object-cover z-0 opacity-10 pointer-events-none"
      >
        <source src="/ambient-bg.mp4" type="video/mp4" />
      </video>

      <audio id="bgMusic" src="/audio/calm-ambient.mp3" loop hidden />

      {/* Top Wavy Corner */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-0">
        <svg
          className="relative block w-full h-[100px]"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <path
            d="M0,0V46.29c47.18,22.24,103.21,29,158,17.39C267.56,41.17,327.79,1.12,400,0c72.21-1.12,132.44,39.05,200,49.79,67.56,10.74,137.8-5.9,200-24.5C935.2,6.4,995.43-3.88,1048,1.25c43.51,4.13,85.69,19.34,152,35V0Z"
            fill="#e0e7ff"
          ></path>
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fadeIn">
          <h1 className="text-5xl font-extrabold text-indigo-700 mb-3 drop-shadow-md">
            Find Your Inner Calm
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Recharge, reflect, and relax. Curated meditations just for teens.
          </p>
        </div>

        <div className="flex justify-center gap-4 mb-10 flex-wrap">
          {["All", "Sleep", "Stress", "Affirmations", "Inspiration"].map((cat) => (
            <button
              key={cat}
              className={`px-4 py-2 rounded-full font-medium transition ${
                filter === cat
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-white/60 hover:bg-white/80 text-indigo-600"
              }`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeIn">
          {filteredVideos.map((video, idx) => (
            <div
              key={idx}
              className="bg-white/60 backdrop-blur-md p-4 rounded-3xl shadow-md hover:shadow-xl transition transform hover:scale-[1.015]"
            >
              <div className="aspect-video overflow-hidden rounded-xl mb-3 shadow-inner">
                <iframe
                  className="w-full h-full"
                  src={video.url}
                  title={video.title}
                  frameBorder="0"
                  allowFullScreen
                ></iframe>
              </div>
              <h3 className="text-lg font-semibold text-indigo-800 text-center">
                {video.title}
              </h3>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center text-indigo-600 text-xl font-medium italic opacity-80 animate-fadeIn">
          “You are not a drop in the ocean. You are the entire ocean in a drop.”
        </div>
      </div>

      {/* Bottom Wavy Corner */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] rotate-180 z-0">
        <svg
          className="relative block w-full h-[100px]"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
        >
          <path
            d="M0,0V46.29c47.18,22.24,103.21,29,158,17.39C267.56,41.17,327.79,1.12,400,0c72.21-1.12,132.44,39.05,200,49.79,67.56,10.74,137.8-5.9,200-24.5C935.2,6.4,995.43-3.88,1048,1.25c43.51,4.13,85.69,19.34,152,35V0Z"
            fill="#e0e7ff"
          ></path>
        </svg>
      </div>
    </div>
  );
}
