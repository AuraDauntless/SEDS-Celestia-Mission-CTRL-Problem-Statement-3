import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useStars } from '../hooks/useStars';
import { starTypeToColor } from '../utils/colorMapping';

// Convert to plotting values: reverse temperature (hot on left) and log10 luminosity
function toPoint(star: any) {
    const x = star.temperature_k ?? 0;
    const y = star.luminosity_solar > 0 ? Math.log10(star.luminosity_solar) : 0;
    return { x, y, id: star.id, name: star.name, type: star.type, radius: star.radius_solar };
}

export function HRDiagram() {
    const { filteredStars, selectStar, selectedStarId } = useStars();
    const data = filteredStars.filter(s => s.temperature_k && s.luminosity_solar).map(toPoint);

    return (
        <div className="h-[calc(100vh-140px)]">
            <h1 className="text-xl font-semibold mb-3">HR Diagram</h1>
            <ResponsiveContainer width="100%" height="90%">
                <ScatterChart margin={{ top: 10, right: 30, bottom: 10, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1f2a44" />
                    <XAxis
                        type="number"
                        dataKey="x"
                        name="Temperature (K)"
                        domain={[2000, 40000]}
                        reversed
                        tick={{ fill: '#9fb1cc' }}
                        label={{ value: 'Temperature (K) → hot on left', position: 'insideBottom', fill: '#9fb1cc' }}
                    />
                    <YAxis
                        type="number"
                        dataKey="y"
                        name="log10(Luminosity)"
                        domain={[-4, 6]}
                        tick={{ fill: '#9fb1cc' }}
                        label={{ value: 'log10(Luminosity L☉)', angle: -90, position: 'insideLeft', fill: '#9fb1cc' }}
                    />
                    <Tooltip
                        cursor={{ strokeDasharray: '3 3' }}
                        content={({ active, payload }) => {
                            if (!active || !payload || payload.length === 0) return null;
                            const p: any = payload[0].payload;
                            return (
                                <div className="rounded-md border border-white/10 bg-panel/90 px-3 py-2 text-sm">
                                    <div className="font-medium" style={{ color: starTypeToColor(p.type) }}>{p.name}</div>
                                    <div className="text-white/70">{p.type}</div>
                                    <div className="mt-1 text-white/80">Temp: {Math.round(p.x)} K</div>
                                    <div className="text-white/80">log10(L): {p.y.toFixed(2)}</div>
                                </div>
                            );
                        }}
                    />
                    <Legend />
                    <Scatter
                        name="Stars"
                        data={data}
                        onClick={(p) => selectStar(p.id)}
                        shape={(props: any) => {
                            const c = starTypeToColor(props.payload.type);
                            const isSel = selectedStarId === props.payload.id;
                            const r = Math.max(3, Math.min(10, (props.payload.radius ?? 1) * 0.8)) + (isSel ? 2 : 0);
                            return (
                                <circle cx={props.cx} cy={props.cy} r={r} fill={c} stroke={isSel ? '#fff' : 'transparent'} strokeWidth={2} />
                            );
                        }}
                    />
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
}


