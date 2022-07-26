import supabase from "../../../src/supabase/supabase";

const favoriteApi = async (req, res) => {
  const { created_at, walletAddress } = req.body;

  let { data, error } = await supabase
    .from("users")
    .update({ verified_timestamp: created_at })
    .eq("walletAddress", walletAddress);

  if (error) {
    res.status(400).json({ error: error.message });
  } else {
    res.status(200).json({ data: data });
  }
};

export default favoriteApi;
