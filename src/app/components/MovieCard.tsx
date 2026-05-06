import { Movie } from '../types/movie';
import { Star, Clock, Calendar } from 'lucide-react';
import { Link } from 'react-router';
import { motion } from 'motion/react';

interface MovieCardProps {
  movie: Movie;
  index?: number;
}

export function MovieCard({ movie, index = 0 }: MovieCardProps) {
  const releaseYear = (() => {
    const year = new Date(movie.releaseDate).getFullYear();
    return Number.isNaN(year) ? 'TBA' : year;
  })();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={`/movie/${movie.id}`}>
        <div className="group relative rounded-xl overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 border border-purple-900/20 hover:border-purple-600/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/30 h-full">
          {/* Poster Image */}
          <div className="relative aspect-[2/3] overflow-hidden">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            {/* Rating Badge */}
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-950/80 backdrop-blur-sm border border-amber-500/30">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span className="text-sm font-semibold text-amber-500">{movie.rating}</span>
            </div>
            
            {/* Age Rating Badge */}
            <div className="absolute top-3 left-3 px-2 py-1 rounded bg-purple-600/80 backdrop-blur-sm text-xs font-semibold">
              {movie.ageRating}
            </div>
          </div>
          
          {/* Movie Info */}
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-purple-400 transition-colors">
              {movie.title}
            </h3>
            
            {/* Genres */}
            <div className="flex flex-wrap gap-1 mb-3">
              {movie.genre.slice(0, 3).map((genre) => (
                <span
                  key={genre}
                  className="text-xs px-2 py-1 rounded-full bg-purple-900/30 text-purple-300 border border-purple-800/30"
                >
                  {genre}
                </span>
              ))}
            </div>
            
            {/* Meta Info */}
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{movie.duration}m</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>{releaseYear}</span>
              </div>
            </div>
            
            {/* Price */}
            <div className="mt-3 pt-3 border-t border-purple-900/20">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">From</span>
                <span className="text-lg font-semibold text-amber-500">₹{movie.price}</span>
              </div>
            </div>
          </div>
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </div>
      </Link>
    </motion.div>
  );
}
