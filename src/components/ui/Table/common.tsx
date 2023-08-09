export const getNameFromPath = (path: string, data: any): string => {
    const s = path.split('.')
    for(var i = 0; i < s.length; i++){
        data = data[s[i]]
    }

    return data
}