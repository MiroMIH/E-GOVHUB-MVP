import { useState, useEffect } from "react";
import { useGetUserQuery } from "../state/api";

const useFetchUserDetails = (userIds) => {
  const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      const details = {};
      for (const userId of userIds) {
        const { data } = await useGetUserQuery(userId);
        if (data) {
          details[userId] = `${data.firstName} ${data.lastName}`;
        }
      }
      setUserDetails(details);
    };

    if (userIds && userIds.length > 0) {
      fetchUsers();
    }
  }, [userIds]);

  return userDetails;
};

export default useFetchUserDetails;
