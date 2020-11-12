class QueryParser {
    constructor(firstDelimiter, secondDelimiter) {
        this.firstDelimiter = typeof firstDelimiter === "string" ? firstDelimiter : " ";
        this.secondDelimiter = typeof secondDelimiter === "string" ? secondDelimiter : ":";
    }

    parse(queryString) {
        if (typeof queryString !== "string") {
            return null;
        }

        const queryMap = new Map();

        queryString.split(this.firstDelimiter).forEach((element) => {
            const kv = element.split(this.secondDelimiter);
            if (kv.length === 2) {
                const key = kv[0];
                const value = kv[1];

                const existedValue = queryMap.get(key);

                if (existedValue === undefined) {
                    queryMap.set(key, [value]);
                } else if (Array.isArray(existedValue)) {
                    existedValue.push(value);
                }
            }
        });

        return queryMap;
    }
}

export { QueryParser };
