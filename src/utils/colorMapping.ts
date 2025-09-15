export const typeColorMap: Record<string, string> = {
    'Red Dwarf': '#ff4f58',
    'Main Sequence (A-type)': '#bfe8ff',
    'Main Sequence (G-type)': '#bfe8ff',
    'Red Supergiant': '#ff9f43',
    'Blue Supergiant': '#7ad3ff',
    'Neutron Star': '#c6c0ff',
    'Pulsar': '#e0d7ff'
};

export function starTypeToColor(type: string): string {
    return typeColorMap[type] ?? '#ffffff';
}


