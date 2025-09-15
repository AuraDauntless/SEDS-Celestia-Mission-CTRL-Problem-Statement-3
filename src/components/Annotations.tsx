import { useState } from 'react';
import type { Annotation } from '../types';
import { useStars } from '../hooks/useStars';

export function Annotations({ starId }: { starId: number }) {
    const { annotationsFor, addAnnotation, updateAnnotation, deleteAnnotation } = useStars();
    const [text, setText] = useState('');
    const list = annotationsFor(starId);

    return (
        <div className="mt-4">
            <h4 className="font-medium mb-2">Annotations</h4>
            <div className="flex gap-2 mb-2">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Add a note..."
                    className="flex-1 bg-white/10 px-2 py-1 rounded"
                    aria-label="Add annotation"
                />
                <button
                    onClick={() => {
                        if (!text.trim()) return;
                        addAnnotation(starId, text.trim());
                        setText('');
                    }}
                    className="px-3 py-1 rounded bg-accent/20 hover:bg-accent/30"
                >
                    Add
                </button>
            </div>
            <ul className="space-y-2">
                {list.map((a) => (
                    <li key={a.id} className="p-2 bg-white/5 rounded border border-white/10">
                        <div className="flex items-center justify-between gap-2">
                            <input
                                className="flex-1 bg-transparent outline-none"
                                value={a.text}
                                onChange={(e) => updateAnnotation(starId, a.id, e.target.value)}
                                aria-label="Edit annotation"
                            />
                            <button onClick={() => deleteAnnotation(starId, a.id)} aria-label="Delete annotation">🗑️</button>
                        </div>
                        <div className="text-xs text-white/50 mt-1">{new Date(a.createdAt).toLocaleString()}</div>
                    </li>
                ))}
            </ul>
        </div>
    );
}


