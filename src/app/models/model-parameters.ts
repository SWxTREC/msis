export interface IAltitudeData {
    altitudeForm: number[];
    AnomO: number[];
    Ar: number[];
    H: number[];
    He: number[];
    Mass: number[];
    N: number[];
    N2: number[];
    N0: number[];
    O: number[];
    O2: number[];
    Temperature: number[];
}

export interface IAltitudeParameters {
    ap: number;
    date: Date;
    f107: number;
    f107a: number;
    latitude: number;
    longitude: number;
    options?: string;
}

export interface ISurfaceData {
    AnomO: number[];
    Ar: number[];
    H: number[];
    He: number[];
    Latitude: number[];
    Longitude: number[];
    Mass: number[];
    N: number[];
    N2: number[];
    N0: number[];
    O: number[];
    O2: number[];
    Temperature: number[];
}

export interface ISurfaceParameters {
    altitude: number;
    ap: number;
    date: Date;
    f107: number;
    f107a: number;
    options?: string;
}
