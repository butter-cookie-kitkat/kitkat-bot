export function concat(...strings) {
    return strings.filter((string) => !!string).join(' ');
}