class QueryParser {
    static parse(queryString) {
        if (typeof queryString !== "string") {
            return null;
        }

        const queryMap = new Map();

        queryString.split(" ").forEach((element) => {
            const kv = element.split(":");
            if (kv.length === 2) {
                const key = kv[0];
                const value = kv[1];

                const existedValue = queryMap.get(key);

                if (existedValue === undefined) {
                    queryMap.set(key, value);
                } else if (Array.isArray(existedValue)) {
                    existedValue.push(value);
                } else {
                    queryMap.set(key, [existedValue, value]);
                }
            }
        });

        return queryMap;
    }
}

export { QueryParser };
