// Deterministic PRNG for stable star placements based on id
export function mulberry32(seed: number) {
    let t = seed >>> 0;
    return function () {
        t += 0x6D2B79F5;
        let r = Math.imul(t ^ (t >>> 15), 1 | t);
        r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
        return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
    };
}

import type { Star } from '../types';
export function computeStarPosition(star: Star) {
    const rnd = mulberry32(star.id);
    const r = rnd() * 200 + (star.distance_ly ?? 0) * 0.02;
    const theta = rnd() * Math.PI * 2;
    const z = (rnd() - 0.5) * 40;
    const x = Math.cos(theta) * r;
    const y = z;
    const zz = Math.sin(theta) * r;
    return { x, y, z: zz };
}
