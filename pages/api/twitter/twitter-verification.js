import {
  getclientID,
  getMentions,
  filterMentions,
} from "../../../src/utils/utils";

const handler = async (req, res) => {
  const { walletAddress } = req.query;
  let error;

  const { id } = await getclientID();
  const mentions = await getMentions(id);
  const mention = await filterMentions(mentions, walletAddress);
  if (!mention === {}) {
    res.status(400).json({ error: error.message });
  } else {
    res.status(200).json({ mention: mention });
  }
};
export default handler;
