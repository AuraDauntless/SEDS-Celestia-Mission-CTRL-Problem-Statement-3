import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { Star, Annotation } from '../types';
import { useSelectedStar } from '../context/SelectedStarContext';
import { useNavigate } from 'react-router-dom';
import { computeStarPosition } from '../utils/seeded';

type SortKey = 'name' | 'distance_ly' | 'temperature_k' | 'luminosity_solar';

type StarsCtx = {
    allStars: Star[];
    filteredStars: Star[];
    paginatedStars: Star[];
    page: number;
    totalPages: number;
    setPage: (p: number) => void;
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    typeFilters: Set<string>;
    toggleTypeFilter: (t: string) => void;
    distanceRange: [number, number];
    setDistanceRange: (v: [number, number]) => void;
    temperatureRange: [number, number];
    setTemperatureRange: (v: [number, number]) => void;
    luminosityRange: [number, number];
    setLuminosityRange: (v: [number, number]) => void;
    resetFilters: () => void;
    sortBy: SortKey;
    setSortBy: (k: SortKey) => void;
    favorites: number[];
    toggleFavorite: (id: number) => void;
    selectStar: (id: number) => void;
    clearSelection: () => void;
    selectedStarId: number | null;
    selectedStar: Star | undefined;
    randomStar: () => void;
    addToCompare: (id: number) => void;
    removeFromCompare: (id: number) => void;
    clearCompare: () => void;
    compareSet: number[];
    annotationsFor: (starId: number) => Annotation[];
    addAnnotation: (starId: number, text: string) => void;
    updateAnnotation: (starId: number, annId: string, text: string) => void;
    deleteAnnotation: (starId: number, annId: string) => void;
    jumpToMap: (id: number) => void;
};

const StarsContext = createContext<StarsCtx | undefined>(undefined);

const FAV_KEY = 'gsc_favorites_v1';
const ANN_KEY = 'gsc_annotations_v1';

function loadJSON<T>(key: string, fallback: T): T {
    try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback; } catch { return fallback; }
}
function saveJSON<T>(key: string, value: T) { try { localStorage.setItem(key, JSON.stringify(value)); } catch { } }

export function StarsProvider({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate();
    const { selectedStarId, setSelectedStarId } = useSelectedStar();
    const [allStars, setAllStars] = useState<Star[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [typeFilters, setTypeFilters] = useState<Set<string>>(new Set());
    const [distanceRange, setDistanceRange] = useState<[number, number]>([0, 5000]);
    const [temperatureRange, setTemperatureRange] = useState<[number, number]>([1000, 60000]);
    const [luminosityRange, setLuminosityRange] = useState<[number, number]>([0, 200000]);
    const [sortBy, setSortBy] = useState<SortKey>('name');
    const [page, setPage] = useState(1);
    const pageSize = 50;

    const [favorites, setFavorites] = useState<number[]>(() => loadJSON<number[]>(FAV_KEY, []));
    const [annotations, setAnnotations] = useState<Record<number, Annotation[]>>(() => loadJSON(ANN_KEY, {}));
    const [compareSet, setCompareSet] = useState<number[]>([]);

    useEffect(() => { saveJSON(FAV_KEY, favorites); }, [favorites]);
    useEffect(() => { saveJSON(ANN_KEY, annotations); }, [annotations]);

    useEffect(() => {
        fetch('/data/stars.json')
            .then((r) => r.json())
            .then((d: Star[]) => setAllStars(d))
            .catch((e) => console.error('Failed to load stars.json', e));
    }, []);

    const filteredStars = useMemo(() => {
        const q = searchQuery.trim().toLowerCase();
        let arr = allStars.filter((s) => (!q || s.name.toLowerCase().includes(q)));
        if (typeFilters.size > 0) arr = arr.filter((s) => typeFilters.has(s.type));
        arr = arr.filter((s) => s.distance_ly >= distanceRange[0] && s.distance_ly <= distanceRange[1]);
        if (safenum(temperatureRange[0]) || safenum(temperatureRange[1])) {
            arr = arr.filter((s) => {
                const t = s.temperature_k ?? 0;
                return t >= temperatureRange[0] && t <= temperatureRange[1];
            });
        }
        if (safenum(luminosityRange[0]) || safenum(luminosityRange[1])) {
            arr = arr.filter((s) => {
                const L = s.luminosity_solar ?? 0;
                return L >= luminosityRange[0] && L <= luminosityRange[1];
            });
        }
        arr.sort((a, b) => compareBy(a, b, sortBy));
        return arr;
    }, [allStars, searchQuery, typeFilters, distanceRange, temperatureRange, luminosityRange, sortBy]);

    const totalPages = Math.max(1, Math.ceil(filteredStars.length / pageSize));
    const paginatedStars = useMemo(() => {
        const start = (page - 1) * pageSize;
        return filteredStars.slice(start, start + pageSize);
    }, [filteredStars, page]);

    useEffect(() => { setPage(1); }, [searchQuery, typeFilters, distanceRange, temperatureRange, luminosityRange]);

    const toggleTypeFilter = (t: string) => {
        setTypeFilters((prev) => {
            const next = new Set(prev);
            if (next.has(t)) next.delete(t); else next.add(t);
            return next;
        });
    };

    const resetFilters = () => {
        setSearchQuery('');
        setTypeFilters(new Set());
        setDistanceRange([0, 5000]);
        setTemperatureRange([1000, 60000]);
        setLuminosityRange([0, 200000]);
    };

    const toggleFavorite = (id: number) => {
        setFavorites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
    };

    const selectStar = (id: number) => setSelectedStarId(id);
    const clearSelection = () => setSelectedStarId(null);
    const selectedStar = useMemo(() => allStars.find((s) => s.id === selectedStarId), [allStars, selectedStarId]);

    const randomStar = () => {
        if (filteredStars.length === 0) return;
        const idx = Math.floor(Math.random() * filteredStars.length);
        selectStar(filteredStars[idx].id);
    };

    const addToCompare = (id: number) => setCompareSet((s) => (s.includes(id) || s.length >= 3 ? s : [...s, id]));
    const removeFromCompare = (id: number) => setCompareSet((s) => s.filter((x) => x !== id));
    const clearCompare = () => setCompareSet([]);

    const annotationsFor = (starId: number) => annotations[starId] ?? [];
    const addAnnotation = (starId: number, text: string) => {
        const entry: Annotation = { id: crypto.randomUUID(), text, createdAt: Date.now() };
        setAnnotations((prev) => ({ ...prev, [starId]: [...(prev[starId] ?? []), entry] }));
    };
    const updateAnnotation = (starId: number, annId: string, text: string) => {
        setAnnotations((prev) => ({
            ...prev,
            [starId]: (prev[starId] ?? []).map((a) => (a.id === annId ? { ...a, text } : a))
        }));
    };
    const deleteAnnotation = (starId: number, annId: string) => {
        setAnnotations((prev) => ({
            ...prev,
            [starId]: (prev[starId] ?? []).filter((a) => a.id !== annId)
        }));
    };

    const jumpToMap = (_id: number) => {
        // Set selection long enough to compute position and navigate
        setSelectedStarId(_id);
        navigate('/map');
        const star = allStars.find(s => s.id === _id);
        if (star) {
            const pos = computeStarPosition(star);
            try { localStorage.setItem('gsc_focus_star_pos', JSON.stringify({ id: _id, pos })); } catch { }
        }
        // Immediately clear selection to close any open modal
        setSelectedStarId(null);
    };

    const value: StarsCtx = {
        allStars,
        filteredStars,
        paginatedStars,
        page,
        totalPages,
        setPage,
        searchQuery,
        setSearchQuery,
        typeFilters,
        toggleTypeFilter,
        distanceRange,
        setDistanceRange,
        temperatureRange,
        setTemperatureRange,
        luminosityRange,
        setLuminosityRange,
        resetFilters,
        sortBy,
        setSortBy,
        favorites,
        toggleFavorite,
        selectStar,
        clearSelection,
        selectedStarId,
        selectedStar,
        randomStar,
        addToCompare,
        removeFromCompare,
        clearCompare,
        compareSet,
        annotationsFor,
        addAnnotation,
        updateAnnotation,
        deleteAnnotation,
        jumpToMap
    };

    return <StarsContext.Provider value={value}>{children}</StarsContext.Provider>;
}

export function useStars() {
    const ctx = useContext(StarsContext);
    if (!ctx) throw new Error('useStars must be used within StarsProvider');
    return ctx;
}

function safenum(n?: number) { return typeof n === 'number' && !Number.isNaN(n); }

function compareBy(a: Star, b: Star, key: SortKey) {
    const av = (a as any)[key];
    const bv = (b as any)[key];
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    if (typeof av === 'string') return av.localeCompare(bv);
    return av - bv;
}


