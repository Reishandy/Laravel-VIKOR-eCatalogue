export function useTurncate() {
    return function truncateByChars(text: string, maxChars: number = 300) {
        if (text.length <= maxChars) return text;

        return text.slice(0, maxChars) + '...';
    };
}
