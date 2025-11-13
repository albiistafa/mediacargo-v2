export interface Rute{
    id: number;
    rute: string;
}

export interface GetRuteResponse {
    success: boolean;
    message: string;
    data: Rute[];
}