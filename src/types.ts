export type Star = {
    id: number;
    name: string;
    type: string;
    distance_ly: number;
    mass_solar?: number;
    radius_solar?: number;
    radius_km?: number;
    temperature_k?: number;
    luminosity_solar?: number;
    constellation?: string;
    description?: string;
};

export type Annotation = {
    id: string;
    text: string;
    createdAt: number;
};


