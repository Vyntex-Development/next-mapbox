import supabase from "../../../src/supabase/supabase";

const getAllFavoritesApi = async (req, res) => {
  const { user_id } = req.body;
  //   const nonce = uuidv4();

  let { data, error } = await supabase
    .from("favorite")
    .select("*")
    .eq("user_id", user_id);

  if (error) {
    res.status(400).json({ error: error.message });
  } else {
    res.status(200).json({ favorites: data });
  }
};

export default getAllFavoritesApi;
