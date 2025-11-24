// Interface for Song Model
export interface Song {
    id: string;
    title: string;
    composers: Array<string>;
    characters: Array<string>;
    time: string;
    episodeId: string;
}

// get songs by episodes - see which songs are in which episodes
// Interface for Episode Songs Model
export interface EpisodeSongs {
    id: string;
    title: string;
    episodeId: string;
}

// get songs by characters - organize by which character is in which song
export interface CharacterSongs {
    id: string;
    title: string;
    character: string;
}

// get the voice actors for characters and add them to the song array