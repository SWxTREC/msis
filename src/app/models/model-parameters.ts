export interface IModelParameters {
    objectType: string;
    diameter: number;
    length: number;
    area: number;
    pitch: number;
    sideslip: number;
    temperature: number;
    speed: number;
    composition: {
        o: number;
        o2: number;
        n2: number;
        he: number;
        h: number;
    };
    accommodationModel: string;
    energyAccommodation: number;
    surfaceMass: number;
}
