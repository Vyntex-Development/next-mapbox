import { useState, useEffect } from "react";
import { useRouter } from "next/router";

const useDeploy = (user, countryDetails, endpoint) => {
  const [canDeploy, setCanDeploy] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (user || router.query[endpoint]) {
      const countryName = countryDetails.fields["Name"];
      const spliitedUserAddress = user?.address?.split(",");
      if (!spliitedUserAddress) return;
      const countryOfUser =
        spliitedUserAddress[spliitedUserAddress.length - 1].trim() + " DAO";
      // console.log(countryOfUser);
      // console.log(countryName);

      const userCanDeploy = countryOfUser === countryName;
      setCanDeploy(userCanDeploy);
    }
  }, [user, router.query[endpoint]]);

  return {
    canDeploy,
  };
};

export default useDeploy;
