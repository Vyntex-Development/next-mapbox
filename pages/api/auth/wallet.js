import { ethers } from "ethers";
import jwt from "jsonwebtoken";
import supabase from "../../../src/supabase/supabase";

const walletApi = async (req, res) => {
  try {
    const { walletAddress, signature, nonce } = req.body;
    const signerAddress = ethers.utils.verifyMessage(nonce, signature);

    if (signerAddress !== walletAddress) {
      throw new Error("wrong signature");
    }

    let { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("walletAddress", walletAddress)
      .eq("nonce", nonce)
      .single();

    const token = jwt.sign(
      {
        aud: "authenticated",
        exp: Math.floor(Date.now() / 1000 + 60 * 60),
        // sub: data.id,
        // user_metadata: {
        //   id: data.id,
        // },
        role: "authenticated",
      },
      process.env.SUPABASE_JWT_TOKEN_SECRET
    );

    res.status(200).json({ data, token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export default walletApi;
