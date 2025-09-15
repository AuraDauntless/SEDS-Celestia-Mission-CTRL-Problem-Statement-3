import { createContext, useContext, useState, useMemo } from 'react';

type Ctx = {
    selectedStarId: number | null;
    setSelectedStarId: (id: number | null) => void;
};

const SelectedStarContext = createContext<Ctx | undefined>(undefined);

export function SelectedStarProvider({ children }: { children: React.ReactNode }) {
    const [selectedStarId, setSelectedStarId] = useState<number | null>(null);
    const value = useMemo(() => ({ selectedStarId, setSelectedStarId }), [selectedStarId]);
    return <SelectedStarContext.Provider value={value}>{children}</SelectedStarContext.Provider>;
}

export function useSelectedStar() {
    const ctx = useContext(SelectedStarContext);
    if (!ctx) throw new Error('useSelectedStar must be used within SelectedStarProvider');
    return ctx;
}


