
declare module "TYPES" {
    export type Music = {
        id: number;
        title: string;
        artist: string;
        genre: string;
        genreName: string;
        status: string;
        albumCover: string;
        view: number;
        likes: number;
        themes: string[];
        rank: number;
        score: number;
    };

    export type Singer = {
        id: number;
        artistName: string;
        gender: string;
        genderName: string;
        nation: string;
        agency: string;
        activityPeriod: string;
        profileImage: string;
    };

    export type Group = {
        id: number;
        groupName: string;
        groupType: string;
        groupTypeName: string;
        groupSize: number;
        agency: string;
        profileImage: string;
        members: Singer[];
    };

    export type User = {
        userId: number;
        loginId: string;
        password: string;
        email: string;
        nickname: string;
        role: string;
        gender: string;
        age: number;
        createdAt: string;
        deletedAt: string | null;
        isDeleted: boolean;
        isBanned: boolean;
        isLocked: boolean;
        profileImage: string;
    };
}