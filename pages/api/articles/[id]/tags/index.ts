import { NextApiHandler } from "next";
const db = require('../../../db');

const ArticleTagsIndexHandler: NextApiHandler = (req, res) => {

  const { method, body, query } = req;
  const { id } = query;

  if(method == 'POST'){
    addArticleTag(res, body, id);
  }else{
    res.status(500).json({ message: 'cannot reponse to this http method' })
  }
  
}

// 添加标签
function addArticleTag(res, body, id){
  const { tagId, tagName } = body;
  if(!tagId){
    if(!tagName){res.status(400).json({ message: 'The paramater "tagName" is necessary' });}
    db.query(`
      INSERT INTO tags (name) values('${tagName}') 
    `,(err,result) => {
      if(err){
        res.status(500).json({ message: err });
      }else{
        db.query(`select max(id) from tags`, (err, result) => {
          result[0]['max(id)'];
          bindArticleTag(res, result[0]['max(id)'], id);
        })
      }
    });
  }else{
    bindArticleTag(res, tagId, id);
  }
}

// 绑定文章和标签
function bindArticleTag(res, tagId, articleId){
  db.query(`
    INSERT INTO articles_tags (tag_id, article_id) 
    values('${tagId}', '${articleId}') 
  `,(err,result) => {
    if(err){
      res.status(500).json({ message: err });
    }else{
      db.query(`select id, name from tags where id=${tagId}`, (err, result) => {
        res.status(200).json({ message: 'success', data: result[0] });
      })
    }
  });
}

export default ArticleTagsIndexHandler;
