const parseError = (e: any) => {
    try {
        return JSON.parse(JSON.stringify(e, null, 4))
    } catch {
        return e
    }
}

export default parseError
