import { useStars } from '../hooks/useStars';

export function SearchFilters() {
    const {
        distanceRange,
        setDistanceRange,
        temperatureRange,
        setTemperatureRange,
        luminosityRange,
        setLuminosityRange,
        resetFilters
    } = useStars();

    return (
        <div className="p-3 rounded-lg bg-panel/60 border border-white/10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Range
                    label="Distance (ly)"
                    value={distanceRange}
                    onChange={setDistanceRange}
                    min={0}
                    max={5000}
                />
                <Range
                    label="Temperature (K)"
                    value={temperatureRange}
                    onChange={setTemperatureRange}
                    min={1000}
                    max={60000}
                />
                <Range
                    label="Luminosity (L☉)"
                    value={luminosityRange}
                    onChange={setLuminosityRange}
                    min={0}
                    max={200000}
                />
            </div>
            <div className="mt-3 flex justify-end">
                <button onClick={resetFilters} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20">Reset</button>
            </div>
        </div>
    );
}

function Range({
    label,
    value,
    onChange,
    min,
    max
}: {
    label: string;
    value: [number, number];
    onChange: (v: [number, number]) => void;
    min: number;
    max: number;
}) {
    const [vmin, vmax] = value;
    return (
        <div>
            <div className="flex items-center justify-between text-sm mb-1">
                <label className="text-white/80">{label}</label>
                <span className="text-white/60">{Math.round(vmin)} – {Math.round(vmax)}</span>
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={vmin}
                    onChange={(e) => onChange([Number(e.target.value), vmax])}
                    className="flex-1"
                    aria-label={`${label} min`}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={vmax}
                    onChange={(e) => onChange([vmin, Number(e.target.value)])}
                    className="flex-1"
                    aria-label={`${label} max`}
                />
            </div>
        </div>
    );
}


