/**
 * Given a string path to a value in a JS object, gets the value
 * @param path string path to a value, ie. 'path.to.value' => {path: {to: {value: target}}}
 * @param data JS object
 * @returns target in {path: {to: {value: target}}}
 */
export const getValueFromPath = (path: string, data: any): string => {
    const s = path.split('.')
    for(var i = 0; i < s.length; i++){
        data = data[s[i]]
    }

    return data
}