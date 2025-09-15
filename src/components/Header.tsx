import { useState } from 'react';
import debounce from 'lodash.debounce';
import { useStars } from '../hooks/useStars';

export function Header() {
    const { setSearchQuery, typeFilters, toggleTypeFilter, sortBy, setSortBy, randomStar } = useStars();
    const [query, setQuery] = useState('');

    const onChange = debounce((val: string) => setSearchQuery(val), 250);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setQuery(val);
        onChange(val);
    };

    const types = [
        'Red Dwarf',
        'Main Sequence (A-type)',
        'Main Sequence (G-type)',
        'Blue Supergiant',
        'Red Supergiant',
        'Neutron Star'
    ];

    return (
        <header className="sticky top-0 z-10 bg-background/80 backdrop-blur border-b border-white/10">
            <div className="flex items-center gap-3 p-3">
                <input
                    type="text"
                    value={query}
                    onChange={handleInput}
                    placeholder="Search stars by name..."
                    className="flex-1 bg-panel/60 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-accent"
                    aria-label="Search stars"
                />
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-panel/60 px-3 py-2 rounded-md focus:outline-none"
                    aria-label="Sort stars"
                >
                    <option value="name">Name</option>
                    <option value="distance_ly">Distance</option>
                    <option value="temperature_k">Temperature</option>
                    <option value="luminosity_solar">Luminosity</option>
                </select>
                <button
                    onClick={randomStar}
                    className="px-3 py-2 rounded-md bg-accent/20 hover:bg-accent/30"
                    aria-label="Open a random star"
                >
                    Random Star
                </button>
            </div>
            <div className="flex flex-wrap gap-2 px-3 pb-3">
                {types.map((t) => (
                    <button
                        key={t}
                        onClick={() => toggleTypeFilter(t)}
                        className={`text-xs px-2 py-1 rounded-full border ${typeFilters.has(t) ? 'bg-accent/20 border-accent' : 'bg-panel/40 border-white/10'
                            }`}
                        aria-pressed={typeFilters.has(t)}
                    >
                        {t}
                    </button>
                ))}
            </div>
        </header>
    );
}


