export function commands(commands: any) {
    return Object.entries(commands).reduce((output: any, [key, value]) => {
        output[key] = command(value);
        return output;
    }, {});
}

export function command(command: any) {
    return {
        args: {},
        ...command
    }
}