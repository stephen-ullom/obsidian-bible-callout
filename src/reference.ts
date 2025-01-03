import { books } from "./constants/books";

export class Reference {
    constructor(
        public readonly translation: string,
        book: string,
        readonly chapter: number,
        readonly verse?: number,
        readonly length = 1
    ) {
        const bookIndex = books.findIndex((b) => {
            const bookName = book.toLowerCase();
            const isNameMatch = b.name.toLowerCase() === bookName;
            const isAliasMatch = b.aliases?.some(
                (alias) => alias.toLowerCase() === bookName
            );
            return isNameMatch || isAliasMatch;
        });

        if (bookIndex === -1) {
            throw new Error("Invalid book name");
        }

        this.bookId = bookIndex + 1;

        if (chapter < 1 || chapter > books[bookIndex].chapters) {
            throw new Error("Invalid chapter number");
        }
    }

    get book() {
        return books[this.bookId - 1];
    }

    get key() {
        return `${this.translation}-${this.book.name}-${this.chapter}`;
    }

    readonly bookId: number;

    toString() {
        return `${this.translation} - ${this.book.name} ${this.chapter}`;
    }

    static parse(translation: string, text: string): Reference {
        const match = text
            .trim()
            .match(/^(\d?\s*\w+)\s+(\d+)(?::(\d+(?:-\d+)?))?$/);

        if (!match) {
            throw new Error("Invalid reference format");
        }

        const [, bookName, chapter, verseRange] = match;

        if (verseRange?.includes("-")) {
            const [start, end] = verseRange.split("-").map(Number);

            return new Reference(
                translation,
                bookName,
                Number(chapter),
                start,
                end - start + 1
            );
        }

        return new Reference(
            translation,
            bookName,
            Number(chapter),
            Number(verseRange) || undefined
        );
    }
}
