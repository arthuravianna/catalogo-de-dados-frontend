

export function remove_quotes(s:string) {
    if (s[0] == '"' && s[s.length-1] == '"') s = s.substring(1, s.length-1);

    return s;
}