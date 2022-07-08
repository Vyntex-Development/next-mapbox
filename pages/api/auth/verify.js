import supabase from "../../../src/supabase/supabase";
import jwt from "jsonwebtoken";

const verifyApi = async (req, res) => {
  const { walletAddress } = req.body;

  let { data, error } = await supabase
    .from("users")
    .update({ verified: true })
    .match({ walletAddress });

  let { data: user, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("walletAddress", walletAddress)
    .single();

  const token = jwt.sign(
    {
      aud: "authenticated",
      exp: Math.floor(Date.now() / 1000 + 60 * 60),
      user_metadata: {
        user: user,
      },
      role: "authenticated",
    },
    process.env.SUPABASE_JWT_TOKEN_SECRET
  );

  if (error) {
    res.status(400).json({ error: error.message });
  } else {
    res.status(200).json({ token: token });
  }
};

export default verifyApi;
