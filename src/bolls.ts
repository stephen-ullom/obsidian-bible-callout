import { BollsResponse } from "./models/bolls-response";
import { Cache } from "./models/cache";
import { Reference } from "./reference";

export enum BollsEndpoint {
    GetText = "https://bolls.life/get-text",
    GetBooks = "https://bolls.life/get-books",
    GetTranslations = "https://bolls.life/static/bolls/app/views/languages.json",
}

// Bolls API documentation at https://bolls.life/api/
export class Bolls {
    static readonly endpoint = "https://bolls.life/get-text";
    private static cache: Cache = {};

    static async getVerses(reference: Reference): Promise<BollsResponse> {
        // Load from cache if available
        const chapter = Bolls.cache[reference.key];
        if (chapter) return chapter;

        try {
            // Fetch from API
            const response = await fetch(
                `${BollsEndpoint.GetText}/${reference.translation}/${reference.bookId}/${reference.chapter}/`
            );
            const data: BollsResponse = await response.json();

            // Cache the data
            Bolls.cache[reference.key] = data;

            return data;
        } catch (error) {
            throw Error("Failed to fetch data");
        }
    }
}
