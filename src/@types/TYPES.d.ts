
declare module "TYPES" {
    export type Music = {
        id: number;
        title: string;
        artist: string;
        genre: string;
        status: string;
        albumCover: string;
        view: number;
        likes: number;
        themes: string[];
    };

    export type Singer = {
        id: number;
        artistName: string;
        gender: string;
        nation: string;
        agency: string;
        activityPeriod: string;
        profileImage: string;
    };
}