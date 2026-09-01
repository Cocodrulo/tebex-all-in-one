import { ModuleTypes } from "@/enums/ModuleTypes";
import { BasicModule } from "@/models/Modules/BasicModule";

export class Players {
    private _online: number;
    private _max: number;

    constructor(data: { online: number; max: number }) {
        this._online = data.online;
        this._max = data.max;
    }

    get online(): number {
        return this._online;
    }

    get max(): number {
        return this._max;
    }
}

export class ServerStatusData {
    private _header: string;
    private _hostname: string;
    private _port: number;
    private _online: boolean;
    private _players: Players;

    constructor(data: {
        header: string;
        hostname: string;
        port: number;
        online: boolean;
        players: Players;
    }) {
        this._header = data.header;
        this._hostname = data.hostname;
        this._port = data.port;
        this._online = data.online;
        this._players = data.players;
    }

    get header(): string {
        return this._header;
    }

    get hostname(): string {
        return this._hostname;
    }

    get port(): number {
        return this._port;
    }

    get online(): boolean {
        return this._online;
    }

    get players(): Players {
        return this._players;
    }
}

export class ServerStatus extends BasicModule {
    private _data: ServerStatusData;

    constructor(data: {
        id: number;
        startTime: string | number | Date;
        endTime?: string | number | Date;
        data: ServerStatusData;
    }) {
        super({
            id: data.id,
            startTime: data.startTime,
            endTime: data.endTime,
            type: ModuleTypes.ServerStatus,
        });
        this._data = data.data;
    }

    get data(): ServerStatusData {
        return this._data;
    }
}
