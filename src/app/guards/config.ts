import { environment } from "../environments/environment.";

export class Config {
    static get() {
        return {
            apiBackend: environment.apiBackend
        };
    }
}