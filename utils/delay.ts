const delay = async (time: number) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true)
        }, time ?? 100)
    })
}

export default delay
