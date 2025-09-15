import { motion } from 'framer-motion';
import { useStars } from '../hooks/useStars';
import { starTypeToColor } from '../utils/colorMapping';
import type { Star } from '../types';

export function StarCard({ star }: { star: Star }) {
    const { selectStar, favorites, toggleFavorite, selectedStarId } = useStars();
    const selected = selectedStarId === star.id;
    const color = starTypeToColor(star.type);

    return (
        <motion.button
            onClick={() => selectStar(star.id)}
            whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
            className={`text-left p-3 rounded-lg bg-panel/60 border ${selected ? 'border-accent' : 'border-white/10'
                } focus:outline-none focus:ring-2 focus:ring-accent`}
            aria-pressed={selected}
        >
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full" style={{ background: color }} aria-hidden />
                    <h3 className="font-medium">{star.name}</h3>
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(star.id);
                    }}
                    aria-label={favorites.includes(star.id) ? 'Remove favorite' : 'Add favorite'}
                    className="text-yellow-400 hover:scale-110 transition-transform"
                >
                    {favorites.includes(star.id) ? '⭐' : '☆'}
                </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs text-white/80">
                <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/10">{star.type}</span>
                <span>Distance: {star.distance_ly} ly</span>
                {star.temperature_k && <span>Temp: {star.temperature_k} K</span>}
                {star.luminosity_solar && <span>Lum: {star.luminosity_solar} L☉</span>}
            </div>
        </motion.button>
    );
}


