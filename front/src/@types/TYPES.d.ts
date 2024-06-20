
declare module "TYPES" {
    export type Music = {
        id: number;
        title: string;
        artist: string;
        genre: string;
        status: string;
        view: number;
        likes: number;
        themes: string[];
    };
}