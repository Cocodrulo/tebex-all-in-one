export class InvalidWebstoreId extends Error {
    constructor() {
        super("The provided webstore ID is invalid.");
        this.name = "InvalidWebstoreId";
    }
}

export class InvalidWebstoreOrBasketId extends Error {
    constructor() {
        super("The provided webstore or basket ID is invalid.");
        this.name = "InvalidWebstoreOrBasketId";
    }
}

export class InvalidRequest extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidRequest";
    }
}
