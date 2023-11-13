/**
 * Given a string path to a value in a JS object, gets the value
 * @param path string path to a value, ie. 'path.to.value' => {path: {to: {value: target}}}
 * @param data JS object
 * @returns target in {path: {to: {value: target}}}
 */
export const valueFromPath = (path: string, data: any): string => {
    const s = path.split('.')
    for(var i = 0; i < s.length; i++){
        data = data[s[i]]
    }

    return data
}


export interface Obj {
    [key: string]: Obj | {}
}
/**
 * Given a JS object and a patgh string, creates key value pairs, nesting when needed
 * ie. given o = {}, path = "path.to", target = {_eq: "target"}, sets o equal to {path: {to: {_eq: "target"}}}
 * @param o 
 * @param path 
 * @param target 
 */
export const objectFromPath = (o: Obj, path: string, target: {}) => {
    const s = path.split(/\.(.*)/s)
    if(!s[1]) {
        o[s[0]] = target
    }
    else{
        if(!o[s[0]]) o[s[0]] = {}
        objectFromPath(o[s[0]], s[1], target)
    }
}