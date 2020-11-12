import { useState, useEffect } from "react";

const usePromise = (promiseCreator, deps, ...args) => {
    const [resolved, setResolved] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const process = async () => {
        setLoading(true);
        try {
            const result = await promiseCreator(...args);
            setResolved(result);
        } catch (e) {
            setError(e);
        }
        setLoading(false);
    };

    useEffect(() => {
        process();
    }, deps);

    return [loading, resolved, error];
};

export default usePromise;
