// src/hooks/useApi.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const useApi = (url, config = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await axios(url, config);
            setData(result.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    }, [url, JSON.stringify(config)]); // Dependency on URL and config

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch: fetchData };
};

export default useApi;