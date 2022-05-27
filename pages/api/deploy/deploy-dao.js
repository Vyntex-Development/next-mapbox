import supabase from "../../../src/supabase/supabase";
const deployDao = async (req, res) => {
  const {
    user_id,
    place,
    twitter_handle,
    discord_server_url,
    telegram_handle,
    optional,
  } = req.body;
  //   const nonce = uuidv4();
  let { data, error } = await supabase.from("deployed").insert({
    user_id,
    twitter_handle,
    discord_server_url,
    telegram_handle,
    place,
    optional,
  });
  if (error) {
    res.status(400).json({ error: error.message });
  } else {
    res.status(200).json({ data: data });
  }
};
export default deployDao;
