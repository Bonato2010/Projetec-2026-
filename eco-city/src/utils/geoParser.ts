export const mapGeoTo3D = (lat: number, lon: number, bounds: any, scale: number = 200) => {
    // Basic Mercator-style linear mapping for local area
    const x = ((lon - bounds.minLon) / (bounds.maxLon - bounds.minLon)) * scale - (scale / 2);
    const z = -(((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * scale - (scale / 2));
    return { x, z };
};

export const createChunks = (data: any, chunkSize: number = 50) => {
    if (!data.roads || !data.bounds) return [];

    const chunks = new Map<string, any[]>();

    // For demonstration, chunking roads based on 3D grid
    data.roads.forEach((r: any) => {
        const pos = mapGeoTo3D(r.lat, r.lon, data.bounds, 200);
        const cx = Math.floor(pos.x / chunkSize);
        const cz = Math.floor(pos.z / chunkSize);
        const key = `${cx},${cz}`;

        if (!chunks.has(key)) {
            chunks.set(key, []);
        }
        chunks.get(key)!.push(pos);
    });

    return Array.from(chunks.entries()).map(([key, points]) => ({
        id: key,
        points,
        center: {
            x: parseInt(key.split(',')[0]) * chunkSize + chunkSize / 2,
            z: parseInt(key.split(',')[1]) * chunkSize + chunkSize / 2
        }
    }));
};
