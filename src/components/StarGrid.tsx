import { useStars } from '../hooks/useStars';
import { StarCard } from './StarCard';
import { SearchFilters } from './SearchFilters';

export function StarGrid() {
    const { paginatedStars, page, totalPages, setPage } = useStars();
    return (
        <div className="flex flex-col gap-4">
            <SearchFilters />
            {/* Detail modal mounted at root of grid to ensure it's present across views */}
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            {/* Modal will read selectedStar from context */}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {paginatedStars.map((s) => (
                    <StarCard key={s.id} star={s} />
                ))}
            </div>
            <div className="flex items-center justify-center gap-2">
                <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    className="px-3 py-1 bg-panel/60 rounded disabled:opacity-50"
                    disabled={page <= 1}
                >
                    Prev
                </button>
                <span className="text-sm text-white/70">Page {page} / {totalPages}</span>
                <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    className="px-3 py-1 bg-panel/60 rounded disabled:opacity-50"
                    disabled={page >= totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}


