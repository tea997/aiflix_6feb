import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Link } from "react-router";
import Footer from "../components/Footer";

const TMDB_OPTIONS = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NTgzMDFlZGQ2MGEzN2Y3NDlmMzhlNGFmMTJjZDE3YSIsIm5iZiI6MTc0NTQxNjIyNS44NzY5OTk5LCJzdWIiOiI2ODA4ZjAyMTI3NmJmNjRlNDFhYjY0ZWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.NA_LMt6-MUBLAvxMRkZtBoUif4p9YQ6aYZo-lv4-PUE",
    },
};

const UpcomingCardList = ({ title, data, isTV = false }) => {
    return (
        <div className="text-white md:px-4">
            <h2 className="pt-10 pb-5 text-lg font-medium">{title}</h2>
            <Swiper slidesPerView={"auto"} spaceBetween={10} className="mySwiper">
                {data.map((item, index) => (
                    <SwiperSlide key={index} className="max-w-72">
                        <Link to={`/movie/${item.id}`}>
                            <div className="relative">
                                <img
                                    src={`https://image.tmdb.org/t/p/w500/${item.backdrop_path || item.poster_path}`}
                                    alt={item.title || item.name}
                                    className="h-44 w-full object-center object-cover rounded-lg"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-3">
                                    <p className="text-xs text-[#e50914] font-semibold">
                                        📅 {item.release_date || item.first_air_date || "Coming Soon"}
                                    </p>
                                </div>
                            </div>
                            <p className="text-center pt-2">{item.title || item.name}</p>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

const UpcomingPage = () => {
    const [upcomingMovies, setUpcomingMovies] = useState([]);
    const [upcomingTV, setUpcomingTV] = useState([]);
    const [featuredUpcoming, setFeaturedUpcoming] = useState(null);

    useEffect(() => {
        // Fetch upcoming movies
        fetch(
            "https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1",
            TMDB_OPTIONS
        )
            .then((res) => res.json())
            .then((res) => {
                setUpcomingMovies(res.results || []);
                if (res.results && res.results.length > 0) {
                    setFeaturedUpcoming(res.results[0]);
                }
            })
            .catch((err) => console.error(err));

        // Fetch upcoming/on the air TV shows
        fetch(
            "https://api.themoviedb.org/3/tv/on_the_air?language=en-US&page=1",
            TMDB_OPTIONS
        )
            .then((res) => res.json())
            .then((res) => setUpcomingTV(res.results || []))
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="bg-black min-h-screen">
            {/* Hero Section */}
            {featuredUpcoming && (
                <div
                    className="relative h-[70vh] bg-cover bg-center flex items-end"
                    style={{
                        backgroundImage: `linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.3)), url(https://image.tmdb.org/t/p/original/${featuredUpcoming.backdrop_path})`,
                    }}
                >
                    <div className="p-8 md:p-16 max-w-3xl">
                        <div className="flex items-center gap-3 mb-4">
                            <span className="bg-gradient-to-r from-purple-600 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold animate-pulse">
                                🎬 COMING SOON
                            </span>
                            <span className="text-gray-400 text-sm">
                                {featuredUpcoming.release_date}
                            </span>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                            {featuredUpcoming.title}
                        </h1>
                        <p className="text-gray-300 text-sm md:text-base line-clamp-3 mb-6">
                            {featuredUpcoming.overview}
                        </p>
                        <div className="flex gap-4">
                            <button className="bg-[#e50914] text-white px-8 py-3 rounded font-semibold hover:bg-[#b8070f] transition flex items-center gap-2">
                                🔔 Remind Me
                            </button>
                            <button className="bg-gray-600 bg-opacity-70 text-white px-8 py-3 rounded font-semibold hover:bg-opacity-50 transition">
                                ℹ More Info
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Upcoming Content */}
            <div className="p-5">
                <UpcomingCardList title="Upcoming Movies" data={upcomingMovies} />
                <UpcomingCardList title="New TV Episodes" data={upcomingTV} isTV={true} />
                <Footer />
            </div>
        </div>
    );
};

export default UpcomingPage;
