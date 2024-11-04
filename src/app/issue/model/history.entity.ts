export class History {
    id: number;
    date: string;
    user: string;
    event: string;
    description: string;

    constructor() {
        this.id = 0;
        this.date = "";
        this.user = "";
        this.event = "";
        this.description = "";
    }
}
