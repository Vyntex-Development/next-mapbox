import supabase from "../../../src/supabase/supabase";

const addressApi = async (req, res) => {
  const { address, walletAddress } = req.body;

  let { data, error } = await supabase
    .from("users")
    .update({ address })
    .match({ walletAddress });

  if (error) {
    res.status(400).json({ error: error.message });
  } else {
    res.status(200).json({ address: address });
  }
};

export default addressApi;
