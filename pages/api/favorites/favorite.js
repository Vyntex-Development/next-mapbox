import supabase from "../../../src/supabase/supabase";

const favoriteApi = async (req, res) => {
  const { city_name, url, user_id } = req.body;
  //   const nonce = uuidv4();

  let { data, error } = await supabase
    .from("favorite")
    .insert({ city_name, url, user_id });

  if (error) {
    res.status(400).json({ error: error.message });
  } else {
    res.status(200).json({ data: data });
  }
};

export default favoriteApi;
