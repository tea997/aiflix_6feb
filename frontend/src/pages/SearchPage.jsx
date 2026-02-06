import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router";
import { Search } from "lucide-react";
import Footer from "../components/Footer";

const TMDB_OPTIONS = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NTgzMDFlZGQ2MGEzN2Y3NDlmMzhlNGFmMTJjZDE3YSIsIm5iZiI6MTc0NTQxNjIyNS44NzY5OTk5LCJzdWIiOiI2ODA4ZjAyMTI3NmJmNjRlNDFhYjY0ZWUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.NA_LMt6-MUBLAvxMRkZtBoUif4p9YQ6aYZo-lv4-PUE",
    },
};

const SearchPage = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q") || "";
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (query.trim()) {
            setIsLoading(true);
            fetch(
                `https://api.themoviedb.org/3/search/multi?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`,
                TMDB_OPTIONS
            )
                .then((res) => res.json())
                .then((res) => {
                    setResults(res.results || []);
                    setIsLoading(false);
                })
                .catch((err) => {
                    console.error(err);
                    setIsLoading(false);
                });
        } else {
            setResults([]);
        }
    }, [query]);

    return (
        <div className="bg-black min-h-screen p-5">
            <div className="max-w-7xl mx-auto">
                {/* Search Header */}
                <div className="flex items-center gap-3 mb-8">
                    <Search className="w-8 h-8 text-[#e50914]" />
                    <h1 className="text-3xl font-bold text-white">
                        {query ? `Search results for "${query}"` : "Search"}
                    </h1>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-12 h-12 border-4 border-[#e50914] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                )}

                {/* No Results */}
                {!isLoading && query && results.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-xl">No results found for "{query}"</p>
                        <p className="text-gray-500 mt-2">Try searching for something else</p>
                    </div>
                )}

                {/* Results Grid */}
                {!isLoading && results.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {results.map((item) => (
                            <Link
                                to={`/movie/${item.id}`}
                                key={item.id}
                                className="group"
                            >
                                <div className="relative overflow-hidden rounded-lg">
                                    {item.poster_path || item.backdrop_path ? (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w500/${item.poster_path || item.backdrop_path}`}
                                            alt={item.title || item.name}
                                            className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                                        />
                                    ) : (
                                        <div className="w-full h-64 bg-[#333] flex items-center justify-center">
                                            <span className="text-gray-500">No Image</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="absolute bottom-0 left-0 right-0 p-3">
                                            <span className="text-xs text-[#e50914] font-semibold uppercase">
                                                {item.media_type === "movie" ? "Movie" : item.media_type === "tv" ? "TV Show" : "Person"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <p className="text-white text-sm mt-2 text-center line-clamp-2 group-hover:text-[#e50914] transition-colors">
                                    {item.title || item.name}
                                </p>
                                {item.release_date || item.first_air_date ? (
                                    <p className="text-gray-500 text-xs text-center">
                                        {(item.release_date || item.first_air_date)?.split("-")[0]}
                                    </p>
                                ) : null}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!query && (
                    <div className="text-center py-20">
                        <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-xl">Start typing to search</p>
                        <p className="text-gray-500 mt-2">Search for movies, TV shows, and more</p>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default SearchPage;
