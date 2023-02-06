import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";

type RequestInfo = {
  isLoading: boolean,
  error: boolean
}

function useFetch<T>(url: string) {
  const [fetchedData, setFechedData] = useState<T | null>(null);
  const [requestInfo, setRequestInfo] = useState<RequestInfo>({
    isLoading: true,
    error: false,
  });

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get<T | null>(url);
      const data = await response.data;
      if (data) {
        setFechedData(data);
      }
    } catch (e) {
      if (axios.isCancel(e)) {
        console.log(`fetched data aborted ${e}`);
      } else {
        console.log("error occured", e);
      }
      setFechedData(null);
      setRequestInfo({
        isLoading: false,
        error: true,
      });
    } finally {
      setRequestInfo((prevInfo) => ({
        ...prevInfo,
        isLoading: false,
      }));
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [url, fetchData]);

  return { data: fetchedData, ...requestInfo };
}

export default useFetch;
