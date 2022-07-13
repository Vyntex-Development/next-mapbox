import supabase from "../../../src/supabase/supabase";

const usersApi = async (req, res) => {
  try {
    let { data } = await supabase.from("users").select("*");
    res.status(200).json({ data });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export default usersApi;
