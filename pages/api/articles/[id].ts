import { NextApiHandler } from "next";
const db = require('../db');

const ArticleHandler: NextApiHandler = (req, res) => {

  const { method, body, query } = req;
  const id = query.id;

  if(method == 'POST'){
    update(res, body, id);
  }else if(method == 'GET'){
    get(res, id);
  }else{
    res.status(500).json({ message: 'cannot reponse to this method' })
  }
  
}

// query one article
function get(res, id){
  if(!id){
    res.status(400).json({ message: 'The paramater "id" is missed' }); return;
  }
  db.query(`
    select articles.*, GROUP_CONCAT(tags.name) as tags
    from articles 
    LEFT JOIN articles_tags on articles_tags.article_id = articles.id
    LEFT JOIN tags on articles_tags.tag_id = tags.id
    where articles.name = '${id}'
    group by articles.id
  `,(err,result) => {
    if(err){
      res.status(500).json({ message: err });
    }else{
      if(result[0]){
        res.status(200).json(result[0]);
      }else{
        res.status(400).json({ message: 'Invalid id' });
      }
    }
  });
}

// update one article
function update(res, body, id){
  let { name, title, abstract, content } = body;
  if(!id){
    res.status(400).json({ message: 'The paramater "id" is missed' }); return;
  }
  db.query(`
    UPDATE articles 
    SET name = '${name}',
        content = '${content}',
        title = '${title}',
        abstract = '${abstract}'
    WHERE articles.id = '${id}'
  `,(err,result) => {
    if(err){
      res.status(500).json({ message: err });
    }else{
      res.status(200).json({ message: 'success' });
    }
  });
}

export default ArticleHandler;
