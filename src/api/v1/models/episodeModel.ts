// Interface for Episode Model
export interface Episode {
    id: string;
    title: string;
    airdate: string;
    season: string;
    episode: string;
    director: string;
    writers: Array<string>;
}