import {
  getclientID,
  getMentions,
  filterMentions,
} from "../../../src/utils/utils";

const handler = async (req, res) => {
  const { signature } = req.query;
  let error;
  let mention;

  const { id } = await getclientID();
  const mentions = await getMentions(id);
  mention = await filterMentions(mentions, signature);

  if (!mention === {}) {
    res.status(400).json({ error: error.message });
  } else {
    res.status(200).json({ mention: mention });
  }
};
export default handler;
