import { NextApiHandler } from "next";
const db = require('../../db');

const ArticleHandler: NextApiHandler = (req, res) => {

  const { method, body, query } = req;
  const id = query.id;

  if(method == 'POST'){
    update(res, body, id);
  }else if(method == 'GET'){
    get(res, id);
  }else if(method == 'PATCH'){
    patchStatus(res, body, id);
  }else{
    res.status(500).json({ message: 'cannot reponse to this http method' })
  }
  
}

// query one article
function get(res, id){
  if(!id){
    res.status(400).json({ message: 'The paramater "id" is missed' }); return;
  }
  db.query(`
    select *, publish_status as publishStatus
    from articles 
    where articles.name = '${id}'
  `,(err,result) => {
    if(err){
      res.status(500).json({ message: err });
    }else{
      if(result[0]){
        const { id } = result[0];
        db.query(`
          select name, id
          from tags 
          LEFT JOIN articles_tags on tags.id = articles_tags.tag_id
          where articles_tags.article_id = '${id}'
        `,(err,tagList) => {
          result[0].tagList = tagList ? tagList : [];
          res.status(200).json(result[0]);
        })
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

function patchStatus(res, body, id){
  let { publishStatus } = body;
  if(!id){
    res.status(400).json({ message: 'The paramater "publishStatus" is missed' }); return;
  }
  db.query(`
    UPDATE articles 
    SET publish_status = '${publishStatus}'
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
