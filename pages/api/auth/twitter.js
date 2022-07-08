import supabase from "../../../src/supabase/supabase";

const twitterApi = async (req, res) => {
  const { twitterHandle, walletAddress } = req.body;

  let { data, error } = await supabase
    .from("users")
    .update({ twitterHandle })
    .match({ walletAddress });

  if (error) {
    res.status(400).json({ error: error.message });
  } else {
    res.status(200).json({ verified: "Succesfully verified", token: "" });
  }
};

export default twitterApi;
