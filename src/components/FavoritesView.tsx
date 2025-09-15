import { useStars } from '../hooks/useStars';
import { StarCard } from './StarCard';

export function FavoritesView() {
    const { favorites, filteredStars } = useStars();
    const favSet = new Set(favorites);
    const favStars = filteredStars.filter((s) => favSet.has(s.id));

    return (
        <div>
            <h1 className="text-xl font-semibold mb-3">Favorites</h1>
            {favStars.length === 0 ? (
                <p className="text-white/70">No favorites yet. Mark stars as favorite to see them here.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {favStars.map((s) => (
                        <StarCard key={s.id} star={s} />
                    ))}
                </div>
            )}
        </div>
    );
}


