
export interface IConferenceDay {
    date: Date;
    title: string;
    desc: string;
}

export interface ISpeaker {
    id: string;
    name: string;
    title: string;
    company: string;
    picture: string;
    twitterName: string;
}

export interface IRoomInfo {
    roomId: string;
    name: string;
    url: string;
    theme: string;
}

export interface ISession {
    id: string;
    title: string;
    start: string;
    end: string;
    room: string;
    roomInfo: IRoomInfo;
    speakers: Array<ISpeaker>;
    description: string;
    descriptionShort: string;
    isBreak: boolean;
    percentFull: number; //added to show session attendance
}

export interface IFavouriteSession {
    sessionId: string;
}

export interface IConfTimeSlot {
    title: string;
    isBreak: boolean;
    start: Date;
    end: Date;
}