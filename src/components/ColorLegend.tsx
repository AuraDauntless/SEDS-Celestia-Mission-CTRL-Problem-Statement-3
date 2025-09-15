import { typeColorMap } from '../utils/colorMapping';

export function ColorLegend() {
    return (
        <div className="flex flex-wrap gap-3 text-xs">
            {Object.entries(typeColorMap).map(([type, color]) => (
                <div key={type} className="flex items-center gap-2">
                    <span className="inline-block w-3 h-3 rounded-full" style={{ background: color }} aria-hidden />
                    <span className="text-white/80">{type}</span>
                </div>
            ))}
        </div>
    );
}


