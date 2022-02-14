import { NextApiHandler } from "next";

export const ArticleImageHandler: NextApiHandler = (req, res) => {
  res.status(200).json({message: 'img upload'});
}

export default ArticleImageHandler;