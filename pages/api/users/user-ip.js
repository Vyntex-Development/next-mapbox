import supabase from "../../../src/supabase/supabase";

const ipDetailsApi = async (req, res) => {
  const { ipCountry, ipIso, id } = req.body;

  let { data, error } = await supabase
    .from("users")
    .update({ ipCountry, ipIso })
    .match({ id });

  if (error) {
    res.status(400).json({ error: error.message });
  } else {
    res.status(200).json({ data: data });
  }
};

export default ipDetailsApi;
