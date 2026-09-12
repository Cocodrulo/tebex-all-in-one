import { ModuleTypes } from "@/enums/ModuleTypes";
import { BasicModule } from "./BaseModule";
import { PlayersSchema, ServerStatusDataSchema } from "@/schemas/Module.schema";

/**
 * Represents the players data object in the ServerStatus module.
 */
export class Players {
    private _online: number;
    private _max: number;

    constructor(data: { online: number; max: number }) {
        PlayersSchema.parse(data);
        this._online = data.online;
        this._max = data.max;
    }

    /**
     * The online players of the server.
     */
    get online(): number {
        return this._online;
    }

    /**
     * The max players of the server.
     */
    get max(): number {
        return this._max;
    }
}

/**
 * Represents the data object for the ServerStatus module.
 */
export class ServerStatusData {
    private _header: string;
    private _hostname: string;
    private _port: number;
    private _online: boolean;
    private _players: Players | null;

    constructor(data: {
        header: string;
        hostname: string;
        port: number;
        online: boolean;
        players?: Players | { online: number; max: number } | null;
    }) {
        ServerStatusDataSchema.parse(data);
        this._header = data.header;
        this._hostname = data.hostname;
        this._port = data.port;
        this._online = data.online;
        this._players = data.players
            ? data.players instanceof Players
                ? data.players
                : new Players(data.players)
            : null;
    }

    /**
     * The header of the module.
     */
    get header(): string {
        return this._header;
    }

    /**
     * The hostname of the server.
     */
    get hostname(): string {
        return this._hostname;
    }

    /**
     * The port of the server.
     */
    get port(): number {
        return this._port;
    }

    /**
     * Whether the server is online.
     */
    get online(): boolean {
        return this._online;
    }

    /**
     * The players data of the server.
     */
    get players(): Players | null {
        return this._players;
    }
}

/**
 * Represents the ServerStatus module.
 *
 * @see https://docs.tebex.io/developers/headless-api/guides/sidebar/get-sidebar-modules#serverstatusmodule
 */
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

    /**
     * The data of the module.
     */
    get data(): ServerStatusData {
        return this._data;
    }
}
