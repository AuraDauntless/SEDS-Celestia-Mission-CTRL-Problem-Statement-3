import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const Item = ({ to, label, icon }: { to: string; label: string; icon: string }) => (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-md hover:bg-panel/60 focus:outline-none focus:ring-2 focus:ring-accent ${isActive ? 'bg-panel text-accent' : 'text-white/80'
                }`
            }
            aria-label={label}
        >
            <span className="text-xl" aria-hidden>{icon}</span>
            {!collapsed && <span className="text-sm">{label}</span>}
        </NavLink>
    );

    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 68 : 220 }}
            className="h-full bg-panel/60 backdrop-blur border-r border-white/10 p-3 flex flex-col gap-2"
        >
            {!collapsed && (
                <div className="px-2 py-2 text-sm font-semibold tracking-wide text-white/90 select-none">
                    Galactic Star Catalogue
                </div>
            )}
            <button
                className="mb-2 self-end text-white/70 hover:text-white focus:outline-none"
                onClick={() => setCollapsed((v) => !v)}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                {collapsed ? '»' : '«'}
            </button>
            <Item to="/explore" label="Explore" icon="🧭" />
            <Item to="/hr" label="HR Diagram" icon="📈" />
            <Item to="/map" label="3D Map" icon="🗺️" />
            <Item to="/compare" label="Compare" icon="⚖️" />
            <Item to="/favorites" label="Favorites" icon="⭐" />
        </motion.aside>
    );
}


