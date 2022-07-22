import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const useDeploy = (user, countryDetails, endpoint) => {
  const [userCandDeploy, setUserCanDeploy] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user || router.query[endpoint]) {
      const countryName = countryDetails.fields["Name"].split(" ")[0];
      const spliitedUserAddress = user?.address?.split(",");
      if (!spliitedUserAddress) return;
      const countryOfUser =
        spliitedUserAddress[spliitedUserAddress.length - 1].trim();
      const userCanDeploy = countryOfUser !== countryName;
      setUserCanDeploy(userCanDeploy);
    }
  }, [user, router.query[endpoint]]);

  return {
    userCandDeploy,
  };
};

export default useDeploy;
