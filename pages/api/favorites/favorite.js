import supabase from "../../../src/supabase/supabase";

const favoriteApi = async (req, res) => {
  const { place, url, userId } = req.body;
  //   const nonce = uuidv4();

  console.log(userId, "User id in favorite");

  let { data, error } = await supabase
    .from("favorite")
    .insert({ place, url, userId });

  if (error) {
    res.status(400).json({ error: error.message });
  } else {
    res.status(200).json({ data: data });
  }
};

export default favoriteApi;
