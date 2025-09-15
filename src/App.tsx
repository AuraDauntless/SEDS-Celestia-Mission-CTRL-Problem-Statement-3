import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { FavoritesView } from './components/FavoritesView';
import { StarGrid } from './components/StarGrid';
import { HRDiagram } from './components/HRDiagram';
import { Galaxy3D } from './components/Galaxy3D';
import { ComparePanel } from './components/ComparePanel';
import { SelectedStarProvider } from './context/SelectedStarContext';
import { StarsProvider } from './hooks/useStars';
import { StarModal } from './components/StarModal';

export default function App() {
    const location = useLocation();
    return (
        <SelectedStarProvider>
            <StarsProvider>
                <div className="flex h-screen w-screen overflow-hidden">
                    <Sidebar />
                    <div className="flex-1 flex flex-col">
                        <Header />
                        <main className="flex-1 overflow-auto bg-background p-4">
                            <Routes location={location}>
                                <Route path="/" element={<Navigate to="/explore" replace />} />
                                <Route path="/explore" element={<StarGrid />} />
                                <Route path="/hr" element={<HRDiagram />} />
                                <Route path="/map" element={<Galaxy3D />} />
                                <Route path="/compare" element={<ComparePanel />} />
                                <Route path="/favorites" element={<FavoritesView />} />
                            </Routes>
                        </main>
                    </div>
                    <StarModal />
                </div>
            </StarsProvider>
        </SelectedStarProvider>
    );
}


