import supabase from "../../../src/supabase/supabase";
import { v4 as uuidv4 } from "uuid";

const nonceApi = async (req, res) => {
  const { walletAddress } = req.body;
  const nonce = uuidv4();

  let { data, error } = await supabase
    .from("users")
    .select("nonce")
    .eq("walletAddress", walletAddress);

  if (data.length > 0) {
    let { data, error } = await supabase
      .from("users")
      .update({ nonce })
      .match({ walletAddress });
  } else {
    let { data, error } = await supabase
      .from("users")
      .insert({ nonce, walletAddress });
  }

  if (error) {
    res.status(400).json({ error: error.message });
  } else {
    res.status(200).json({ nonce: nonce });
  }
};

export default nonceApi;
