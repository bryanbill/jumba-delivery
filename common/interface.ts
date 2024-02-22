
export interface Driver {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
    updates: {
        latitude: number;
        longitude: number;
    }[];
}
