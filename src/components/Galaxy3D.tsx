import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useStars } from '../hooks/useStars';
import { starTypeToColor } from '../utils/colorMapping';
import { mulberry32 } from '../utils/seeded';

function createCircleTexture(): THREE.Texture {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, size, size);
    const r = size / 2;
    const grd = ctx.createRadialGradient(r, r, 0, r, r, r);
    grd.addColorStop(0, 'white');
    grd.addColorStop(1, 'transparent');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(r, r, r, 0, Math.PI * 2);
    ctx.fill();
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    return texture;
}

type HoverInfo = { name: string; x: number; y: number } | null;

type StarWithPos = { idx: number; x: number; y: number; z: number; color: THREE.Color; name: string; luminosity: number };

function buildPositionsFor(stars: StarWithPos[]) {
    const arr = new Float32Array(stars.length * 3);
    stars.forEach((s, i) => {
        arr[i * 3] = s.x; arr[i * 3 + 1] = s.y; arr[i * 3 + 2] = s.z;
    });
    return arr;
}
function buildColorsFor(stars: StarWithPos[]) {
    const arr = new Float32Array(stars.length * 3);
    stars.forEach((s, i) => {
        arr[i * 3] = s.color.r; arr[i * 3 + 1] = s.color.g; arr[i * 3 + 2] = s.color.b;
    });
    return arr;
}

function PointsBucket({
    subset,
    size,
    opacity,
    blending,
    circleTex,
    onHoverChange,
    onClickIndex
}: {
    subset: StarWithPos[];
    size: number;
    opacity: number;
    blending?: THREE.Blending;
    circleTex: THREE.Texture;
    onHoverChange: (h: HoverInfo) => void;
    onClickIndex: (localIndex: number) => void;
}) {
    const positions = useMemo(() => buildPositionsFor(subset), [subset]);
    const colors = useMemo(() => buildColorsFor(subset), [subset]);
    return (
        <>
            {/* Soft halo layer */}
            <points
                onPointerMove={(e) => {
                    if (typeof e.index === 'number' && subset[e.index]) {
                        onHoverChange({ name: subset[e.index].name, x: e.clientX, y: e.clientY });
                    }
                }}
                onPointerOut={() => onHoverChange(null)}
                onClick={(e) => {
                    if (typeof e.index === 'number') onClickIndex(e.index);
                }}
            >
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                    <bufferAttribute attach="attributes-color" args={[colors, 3]} />
                </bufferGeometry>
                <pointsMaterial
                    vertexColors
                    sizeAttenuation
                    size={size * 2.2}
                    transparent
                    opacity={Math.min(1, opacity * 0.35)}
                    map={circleTex}
                    alphaTest={0.02}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>

            {/* Core bright point */}
            <points
                onPointerMove={(e) => {
                    if (typeof e.index === 'number' && subset[e.index]) {
                        onHoverChange({ name: subset[e.index].name, x: e.clientX, y: e.clientY });
                    }
                }}
                onPointerOut={() => onHoverChange(null)}
                onClick={(e) => {
                    if (typeof e.index === 'number') onClickIndex(e.index);
                }}
            >
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                    <bufferAttribute attach="attributes-color" args={[colors, 3]} />
                </bufferGeometry>
                <pointsMaterial
                    vertexColors
                    sizeAttenuation
                    size={size}
                    transparent
                    opacity={opacity}
                    map={circleTex}
                    alphaTest={0.2}
                    depthWrite={false}
                    blending={blending ?? THREE.AdditiveBlending}
                />
            </points>
        </>
    );
}

function PointsCloud({ onHoverChange }: { onHoverChange: (h: HoverInfo) => void }) {
    const { filteredStars, selectStar } = useStars();
    const circleTex = useMemo(() => createCircleTexture(), []);

    // Build deterministic positions and color per star
    const starData = useMemo<StarWithPos[]>(() => {
        return filteredStars.map((s, idx) => {
            const rnd = mulberry32(s.id);
            const r = rnd() * 200 + (s.distance_ly ?? 0) * 0.02;
            const theta = rnd() * Math.PI * 2;
            const z = (rnd() - 0.5) * 40;
            const x = Math.cos(theta) * r;
            const y = z;
            const color = new THREE.Color(starTypeToColor(s.type));
            const L = Math.max(1e-6, s.luminosity_solar ?? 0.001);
            return { idx, x, y, z: Math.sin(theta) * r, color, name: s.name, luminosity: L };
        });
    }, [filteredStars]);

    // Bucket by luminosity (log scale)
    const buckets = useMemo(() => {
        const veryDim: StarWithPos[] = [];
        const dim: StarWithPos[] = [];
        const medium: StarWithPos[] = [];
        const bright: StarWithPos[] = [];
        const veryBright: StarWithPos[] = [];
        starData.forEach((s) => {
            const logL = Math.log10(s.luminosity);
            if (logL < -1) veryDim.push(s);
            else if (logL < 0.5) dim.push(s);
            else if (logL < 2) medium.push(s);
            else if (logL < 4) bright.push(s);
            else veryBright.push(s);
        });
        return { veryDim, dim, medium, bright, veryBright };
    }, [starData]);

    const onClickIndex = (localIndex: number, subset: StarWithPos[]) => {
        const original = subset[localIndex];
        if (!original) return;
        const star = filteredStars[original.idx];
        if (star) selectStar(star.id);
    };

    return (
        <>
            <PointsBucket
                subset={buckets.veryDim}
                size={1.2}
                opacity={0.7}
                blending={THREE.AdditiveBlending}
                circleTex={circleTex}
                onHoverChange={onHoverChange}
                onClickIndex={(i) => onClickIndex(i, buckets.veryDim)}
            />
            <PointsBucket
                subset={buckets.dim}
                size={1.8}
                opacity={0.85}
                blending={THREE.AdditiveBlending}
                circleTex={circleTex}
                onHoverChange={onHoverChange}
                onClickIndex={(i) => onClickIndex(i, buckets.dim)}
            />
            <PointsBucket
                subset={buckets.medium}
                size={2.4}
                opacity={0.95}
                blending={THREE.AdditiveBlending}
                circleTex={circleTex}
                onHoverChange={onHoverChange}
                onClickIndex={(i) => onClickIndex(i, buckets.medium)}
            />
            <PointsBucket
                subset={buckets.bright}
                size={3.2}
                opacity={1}
                blending={THREE.AdditiveBlending}
                circleTex={circleTex}
                onHoverChange={onHoverChange}
                onClickIndex={(i) => onClickIndex(i, buckets.bright)}
            />
            <PointsBucket
                subset={buckets.veryBright}
                size={4.2}
                opacity={1}
                blending={THREE.AdditiveBlending}
                circleTex={circleTex}
                onHoverChange={onHoverChange}
                onClickIndex={(i) => onClickIndex(i, buckets.veryBright)}
            />
        </>
    );
}

export function Galaxy3D() {
    const [hover, setHover] = useState<HoverInfo>(null);
    const cameraRef = useRef<any>(null);
    return (
        <div className="h-[calc(100vh-140px)] relative">
            <h1 className="text-xl font-semibold mb-3">3D Galaxy Map</h1>
            <Canvas camera={{ position: [0, 30, 120], fov: 60 }} onCreated={({ camera }) => (cameraRef.current = camera)}>
                <color attach="background" args={["#0b1220"]} />
                <ambientLight intensity={0.4} />
                <PointsCloud onHoverChange={setHover} />
                <OrbitControls enablePan enableZoom enableRotate />
            </Canvas>
            <FocusCamera cameraRef={cameraRef} />
            {hover && (
                <div
                    className="pointer-events-none absolute z-10 rounded-md border border-white/10 bg-panel/90 px-2 py-1 text-xs"
                    style={{ left: hover.x + 10, top: hover.y + 10 }}
                    role="tooltip"
                >
                    {hover.name}
                </div>
            )}
        </div>
    );
}

function FocusCamera({ cameraRef }: { cameraRef: React.MutableRefObject<any> }) {
    // Read desired focus target from localStorage and ease camera toward it
    useEffect(() => {
        const raw = localStorage.getItem('gsc_focus_star_pos');
        if (!raw || !cameraRef.current) return;
        try {
            const { pos } = JSON.parse(raw);
            const cam = cameraRef.current as THREE.PerspectiveCamera;
            // Smoothly move camera toward target while keeping a reasonable distance
            const target = new THREE.Vector3(pos.x, pos.y, pos.z);
            const start = cam.position.clone();
            const end = target.clone().add(new THREE.Vector3(0, 10, 60));
            const duration = 700;
            const t0 = performance.now();
            const tick = () => {
                const t = (performance.now() - t0) / duration;
                const k = Math.min(1, t);
                cam.position.lerpVectors(start, end, k);
                cam.lookAt(target);
                if (k < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        } catch { }
        // Clear the intent so it doesn't re-trigger
        try { localStorage.removeItem('gsc_focus_star_pos'); } catch { }
    }, [cameraRef]);
    return null;
}


