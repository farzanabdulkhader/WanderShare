import { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      setIsLoading(true);

      const source = axios.CancelToken.source();
      activeHttpRequests.current.push(source);

      try {
        // await new Promise((resolve) => setTimeout(resolve, 2000));

        const response = await axios({
          url,
          method,
          data: body,
          headers,
          cancelToken: source.token,
        });

        // Remove the request from the active requests list
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtrl) => reqCtrl !== source
        );

        setIsLoading(false);
        return response.data;
      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request canceled:", err.message);
        } else {
          setError(err.response?.data?.message || err.message);
        }
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((source) => source.cancel());
    };
  }, []);

  return { isLoading, error, sendRequest, clearError };
};
