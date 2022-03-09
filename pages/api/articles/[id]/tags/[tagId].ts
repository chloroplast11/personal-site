import { NextApiHandler } from "next";
const db = require('../../../db');

const ArticleTagsHandler: NextApiHandler = (req, res) => {

  const { method, query } = req;
  const { id, tagId } = query;

  if(method == 'DELETE'){
    deleteArticleTag(res, id, tagId);
  }else{
    res.status(500).json({ message: 'cannot reponse to this http method' })
  }
  
}

// 删除标签
function deleteArticleTag(res, articleId, tagId){
  if(!tagId){
    res.status(400).json({ message: 'The paramater "id" is missed' }); return;
  }
  db.query(`
    delete from articles_tags
    where (tag_id = ${tagId} AND article_id = ${articleId})
  `,(err,result) => {
    if(err){
      res.status(500).json({ message: err });
    }else{
      res.status(200).json({ message: result });
    }
  });
}

export default ArticleTagsHandler;
