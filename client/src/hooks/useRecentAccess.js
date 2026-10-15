import { useEffect } from "react";
import api from "../services/api";

const useRecentAccess = (resourceType, resourceId, title, link) => {
  useEffect(() => {
    if (resourceType && resourceId && title && link) {
      api.post("/recent", { resourceType, resourceId, title, link })
        .catch(err => console.error("Failed to record recent access:", err));
    }
  }, [resourceType, resourceId, title, link]);
};

export default useRecentAccess;
