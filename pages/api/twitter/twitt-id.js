import supabase from "../../../src/supabase/supabase";

const tweetId = async (req, res) => {
  const { id, walletAddress } = req.body;

  let { data, error } = await supabase
    .from("users")
    .update({ tweet_id: id })
    .eq("walletAddress", walletAddress);

  if (error) {
    res.status(400).json({ error: error.message });
  } else {
    res.status(200).json({ data: data });
  }
};

export default tweetId;
