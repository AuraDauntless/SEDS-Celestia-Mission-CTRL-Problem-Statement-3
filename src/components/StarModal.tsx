import { motion, AnimatePresence } from 'framer-motion';
import { useStars } from '../hooks/useStars';
import { starTypeToColor } from '../utils/colorMapping';
import { Annotations } from './Annotations';

export function StarModal() {
    const { selectedStar, clearSelection, toggleFavorite, favorites, addToCompare, jumpToMap } = useStars();
    const open = !!selectedStar;
    const color = selectedStar ? starTypeToColor(selectedStar.type) : '#fff';

    return (
        <AnimatePresence>
            {open && (
                <motion.div className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={clearSelection}
                >
                    <motion.div
                        initial={{ scale: 0.95, y: 10, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 240, damping: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        className="w-full max-w-3xl bg-panel border border-white/10 rounded-xl shadow-glow p-4"
                    >
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <h2 className="text-2xl font-semibold">{selectedStar?.name}</h2>
                                <div className="mt-1 flex items-center gap-2 text-sm">
                                    <span className="px-2 py-0.5 rounded-full bg-white/10 border border-white/10">{selectedStar?.type}</span>
                                    <span className="text-white/70">{selectedStar?.constellation}</span>
                                </div>
                            </div>
                            <button onClick={clearSelection} aria-label="Close" className="text-white/70 hover:text-white">✖</button>
                        </div>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-2">
                                <div className="w-40 h-40 rounded-full" style={{ background: color }} aria-label="Spectral color" />
                                <p className="text-white/80 text-sm">{selectedStar?.description}</p>
                            </div>
                            <div>
                                <table className="w-full text-sm text-white/80">
                                    <tbody>
                                        <tr><td className="py-1">Distance</td><td className="text-right">{selectedStar?.distance_ly} ly</td></tr>
                                        <tr><td className="py-1">Mass</td><td className="text-right">{selectedStar?.mass_solar ?? '—'} M☉</td></tr>
                                        <tr><td className="py-1">Radius</td><td className="text-right">{selectedStar?.radius_solar ?? selectedStar?.radius_km ?? '—'} {selectedStar?.radius_solar ? 'R☉' : selectedStar?.radius_km ? 'km' : ''}</td></tr>
                                        <tr><td className="py-1">Temperature</td><td className="text-right">{selectedStar?.temperature_k ?? '—'} K</td></tr>
                                        <tr><td className="py-1">Luminosity</td><td className="text-right">{selectedStar?.luminosity_solar ?? '—'} L☉</td></tr>
                                    </tbody>
                                </table>
                                <div className="mt-3 flex gap-2">
                                    <button
                                        onClick={() => selectedStar && toggleFavorite(selectedStar.id)}
                                        className="px-3 py-1 rounded bg-white/10 hover:bg-white/20"
                                    >
                                        {selectedStar && favorites.includes(selectedStar.id) ? '★ Favorited' : '☆ Favorite'}
                                    </button>
                                    <button
                                        onClick={() => selectedStar && addToCompare(selectedStar.id)}
                                        className="px-3 py-1 rounded bg-white/10 hover:bg-white/20"
                                    >
                                        Add to Compare
                                    </button>
                                    <button
                                        onClick={() => selectedStar && jumpToMap(selectedStar.id)}
                                        className="px-3 py-1 rounded bg-accent/20 hover:bg-accent/30"
                                    >
                                        Jump to 3D Map
                                    </button>
                                </div>
                            </div>
                        </div>
                        {selectedStar && <Annotations starId={selectedStar.id} />}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}


