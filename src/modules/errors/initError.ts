class InitError {

    private message : string;

    constructor(message: string) {
        this.message = message;
    }
    
    toString() : string {
        return `Error InitFailure: ${this.message}`;
    }
}

export default InitError;