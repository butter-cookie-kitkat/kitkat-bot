export function concat(...strings: Array<string | null | undefined>) {
    return strings.filter((string) => !!string).join(' ');
}