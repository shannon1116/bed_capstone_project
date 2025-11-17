// Interface for Song Model
export interface Song {
    id: string;
    title: string;
    composers: Array<string>;
    characters: Array<string>;
    time: string;
    episodeId: string;
}