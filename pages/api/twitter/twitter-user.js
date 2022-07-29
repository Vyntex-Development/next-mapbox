import { getTwitterUser } from "../../../src/utils/utils";

const handler = async (req, res) => {
  const { id } = req.query;
  const user = await getTwitterUser(id);
  if (!user) {
    res.status(400).json({ error: "User not found" });
  } else {
    res.status(200).json({ user: user });
  }
};
export default handler;
