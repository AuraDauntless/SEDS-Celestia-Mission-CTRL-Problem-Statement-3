// Approximate temperature (K) to RGB color mapping for black-body radiation appearance
// Returns hex string. Based on simplified algorithm; good enough for UI purposes.
export function temperatureToColorHex(kelvin: number): string {
    const clamp = (x: number, min: number, max: number) => Math.max(min, Math.min(max, x));
    let temp = kelvin / 100;
    let r: number, g: number, b: number;

    if (temp <= 66) {
        r = 255;
        g = clamp(99.4708025861 * Math.log(temp) - 161.1195681661, 0, 255);
        b = temp <= 19 ? 0 : clamp(138.5177312231 * Math.log(temp - 10) - 305.0447927307, 0, 255);
    } else {
        r = clamp(329.698727446 * Math.pow(temp - 60, -0.1332047592), 0, 255);
        g = clamp(288.1221695283 * Math.pow(temp - 60, -0.0755148492), 0, 255);
        b = 255;
    }
    const toHex = (n: number) => n.toString(16).padStart(2, '0');
    return `#${toHex(Math.round(r))}${toHex(Math.round(g))}${toHex(Math.round(b))}`;
}


