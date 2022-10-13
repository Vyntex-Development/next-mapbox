import supabase from "../../../src/supabase/supabase";

const favoriteApi = async (req, res) => {
  const { place, url, user_id } = req.body;
  //   const nonce = uuidv4();
  console.log("nesto asdasd");

  let { data, error } = await supabase
    .from("favorite")
    .insert({ place, url, user_id });

  if (error) {
    res.status(400).json({ error: error.message });
  } else {
    res.status(200).json({ data: data });
  }
};

export default favoriteApi;
