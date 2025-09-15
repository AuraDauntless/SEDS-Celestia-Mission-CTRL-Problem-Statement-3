import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useStars } from '../hooks/useStars';

function useQuery() {
    const { search } = useLocation();
    return useMemo(() => new URLSearchParams(search), [search]);
}

export function ComparePanel() {
    const { allStars, compareSet, addToCompare, removeFromCompare, clearCompare } = useStars();
    const navigate = useNavigate();
    const query = useQuery();

    // Sync compare set with URL
    useEffect(() => {
        const ids = compareSet.join(',');
        const params = new URLSearchParams(window.location.search);
        if ((params.get('cmp') ?? '') !== ids) {
            params.set('cmp', ids);
            navigate({ search: params.toString() }, { replace: true });
        }
    }, [compareSet, navigate]);

    // Hydrate from URL
    useEffect(() => {
        const cmp = query.get('cmp');
        if (cmp) {
            cmp.split(',').forEach((id) => addToCompare(Number(id)));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const selected = allStars.filter((s) => compareSet.includes(s.id)).slice(0, 3);

    const exportCSV = () => {
        const headers = ['id', 'name', 'type', 'distance_ly', 'mass_solar', 'radius_solar', 'temperature_k', 'luminosity_solar'];
        const rows = selected.map((s) => headers.map((h) => (s as any)[h] ?? ''));
        const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'compare.csv'; a.click(); URL.revokeObjectURL(url);
    };

    return (
        <div>
            <h1 className="text-xl font-semibold mb-3">Compare</h1>
            <div className="flex gap-3 mb-3">
                <button onClick={exportCSV} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20">Export CSV</button>
                <button onClick={clearCompare} className="px-3 py-1 rounded bg-white/10 hover:bg-white/20">Clear</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selected.map((s) => (
                    <div key={s.id} className="p-3 rounded bg-panel/60 border border-white/10">
                        <div className="flex items-center justify-between">
                            <h3 className="font-medium">{s.name}</h3>
                            <button onClick={() => removeFromCompare(s.id)} aria-label="Remove from compare">✖</button>
                        </div>
                        <div className="my-4 flex items-end justify-center h-40 gap-6">
                            {/* Relative size circles by radius */}
                            <div className="flex items-end gap-2">
                                <div
                                    className="rounded-full bg-white/20 border border-white/30"
                                    style={{ width: Math.min(120, (s.radius_solar ?? 1) * 6), height: Math.min(120, (s.radius_solar ?? 1) * 6) }}
                                    aria-label={`Radius ${s.radius_solar ?? 'N/A'} R☉`}
                                />
                            </div>
                        </div>
                        <table className="w-full text-sm text-white/80">
                            <tbody>
                                <tr><td className="py-1">Type</td><td className="text-right">{s.type}</td></tr>
                                <tr><td className="py-1">Distance (ly)</td><td className="text-right">{s.distance_ly}</td></tr>
                                <tr><td className="py-1">Mass (M☉)</td><td className="text-right">{s.mass_solar ?? '—'}</td></tr>
                                <tr><td className="py-1">Radius (R☉)</td><td className="text-right">{s.radius_solar ?? '—'}</td></tr>
                                <tr><td className="py-1">Temperature (K)</td><td className="text-right">{s.temperature_k ?? '—'}</td></tr>
                                <tr><td className="py-1">Luminosity (L☉)</td><td className="text-right">{s.luminosity_solar ?? '—'}</td></tr>
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
            {selected.length === 0 && (
                <p className="text-white/70">Add up to 3 stars to compare from cards or modal.</p>
            )}
        </div>
    );
}


