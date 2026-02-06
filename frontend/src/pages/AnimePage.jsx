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

const AnimeCardList = ({ title, endpoint, isTV = false }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(endpoint, TMDB_OPTIONS)
            .then((res) => res.json())
            .then((res) => setData(res.results || []))
            .catch((err) => console.error(err));
    }, [endpoint]);

    return (
        <div className="text-white md:px-4">
            <h2 className="pt-10 pb-5 text-lg font-medium">{title}</h2>
            <Swiper slidesPerView={"auto"} spaceBetween={10} className="mySwiper">
                {data.map((item, index) => (
                    <SwiperSlide key={index} className="max-w-72">
                        <Link to={`/movie/${item.id}`}>
                            <img
                                src={`https://image.tmdb.org/t/p/w500/${item.backdrop_path || item.poster_path}`}
                                alt={item.title || item.name}
                                className="h-44 w-full object-center object-cover rounded-lg"
                            />
                            <p className="text-center pt-2">{item.title || item.name}</p>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

const AnimePage = () => {
    const [featuredAnime, setFeaturedAnime] = useState(null);

    useEffect(() => {
        // Fetch popular anime movies (genre 16 = Animation)
        fetch(
            "https://api.themoviedb.org/3/discover/movie?with_genres=16&sort_by=popularity.desc&language=en-US&page=1",
            TMDB_OPTIONS
        )
            .then((res) => res.json())
            .then((res) => {
                if (res.results && res.results.length > 0) {
                    setFeaturedAnime(res.results[0]);
                }
            })
            .catch((err) => console.error(err));
    }, []);

    return (
        <div className="bg-black min-h-screen">
            {/* Hero Section */}
            {featuredAnime && (
                <div
                    className="relative h-[70vh] bg-cover bg-center flex items-end"
                    style={{
                        backgroundImage: `linear-gradient(to top, rgba(0,0,0,1), rgba(0,0,0,0.3)), url(https://image.tmdb.org/t/p/original/${featuredAnime.backdrop_path})`,
                    }}
                >
                    <div className="p-8 md:p-16 max-w-3xl">
                        <span className="bg-[#e50914] text-white px-3 py-1 rounded text-sm font-semibold mb-4 inline-block">
                            ANIME
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                            {featuredAnime.title}
                        </h1>
                        <p className="text-gray-300 text-sm md:text-base line-clamp-3 mb-6">
                            {featuredAnime.overview}
                        </p>
                        <div className="flex gap-4">
                            <button className="bg-white text-black px-8 py-3 rounded font-semibold hover:bg-gray-200 transition">
                                ▶ Play
                            </button>
                            <button className="bg-gray-600 bg-opacity-70 text-white px-8 py-3 rounded font-semibold hover:bg-opacity-50 transition">
                                ℹ More Info
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Anime Categories */}
            <div className="p-5">
                <AnimeCardList
                    title="Popular Anime Movies"
                    endpoint="https://api.themoviedb.org/3/discover/movie?with_genres=16&sort_by=popularity.desc&language=en-US&page=1"
                />
                <AnimeCardList
                    title="Top Rated Anime Movies"
                    endpoint="https://api.themoviedb.org/3/discover/movie?with_genres=16&sort_by=vote_average.desc&vote_count.gte=100&language=en-US&page=1"
                />
                <AnimeCardList
                    title="Anime TV Series"
                    endpoint="https://api.themoviedb.org/3/discover/tv?with_genres=16&sort_by=popularity.desc&language=en-US&page=1"
                    isTV={true}
                />
                <AnimeCardList
                    title="Top Rated Anime Series"
                    endpoint="https://api.themoviedb.org/3/discover/tv?with_genres=16&sort_by=vote_average.desc&vote_count.gte=100&language=en-US&page=1"
                    isTV={true}
                />
                <Footer />
            </div>
        </div>
    );
};

export default AnimePage;
