import supabase from "../../../src/supabase/supabase";
const removeFromFavorite = async (req, res) => {
  const { user_id, city_name } = req.body;
  //   const nonce = uuidv4();
  let { data, error } = await supabase
    .from("favorite")
    .delete()
    .match({ user_id: user_id, city_name: city_name });
  if (error) {
    res.status(400).json({ error: error.message });
  } else {
    res.status(200).json({ data: data });
  }
};
export default removeFromFavorite;
