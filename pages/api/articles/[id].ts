import { NextApiHandler } from "next";
const db = require('../db');

const ArticleHandler: NextApiHandler = (req, res) => {
  console.log(req);
  const { method } = req;
  if(method == 'UPDATE'){
    db.query(`
      select articles.*, GROUP_CONCAT(tags.name) as tags
      from articles 
      LEFT JOIN articles_tags on articles_tags.article_id = articles.id
      LEFT JOIN tags on articles_tags.tag_id = tags.id
      group by articles.id
    `,function(err,result){
      res.status(200).json(result);
    });
  }else{
    res.status(500).json({ message: 'cannot reponse to this method' })
  }
  
}

export default ArticleHandler;
