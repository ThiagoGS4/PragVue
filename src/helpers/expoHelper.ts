export function handleExpoMessageType (event: MessageEvent, typeToMatch: string, functionToExec: Function) {
    try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data
        if (data?.type === typeToMatch) {
            functionToExec()
        }
    } catch {}
}