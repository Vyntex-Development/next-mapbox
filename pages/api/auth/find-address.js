import supabase from "../../../src/supabase/supabase";

const addressApi = async (req, res) => {
  const walletAddress = req.query.walletAddress;

  let { data, error } = await supabase
    .from("users")
    .select("address")
    .match({ walletAddress });

  if (error) {
    res.status(400).json({ error: error.message });
  } else {
    res.status(200).json({ address: data[0].address });
  }
};

export default addressApi;
