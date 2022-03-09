import { NextApiHandler } from "next";
const db = require('../db');

const ArticlesHandler: NextApiHandler = (req, res) => {
  const { method, body, query } = req;
  if(method == 'GET'){
    const { status } = query;
    get(res, status);
  }else if(method == 'POST'){
    add(res, body);
  }else{
    res.status(500).json({ message: 'cannot reponse to this method' })
  }
}

// query all articles
function get(res, status){
  db.query(`
    select articles.*, GROUP_CONCAT(tags.name) as tags, publish_status as publishStatus
    from articles 
    LEFT JOIN articles_tags on articles_tags.article_id = articles.id
    LEFT JOIN tags on articles_tags.tag_id = tags.id
    group by articles.id
    ${status ? '' : 'having publish_status = 2'}
  `,(err,result) => {
      if(err){
        res.status(500).json({ message: err });
      }else{
        res.status(200).json(result);
      }
    });
}

// add one article
function add(res, body){
  let { name, title, abstract, content } = body;
  const dateObj = new Date();
  const date = dateObj.getFullYear() + '-' + (dateObj.getMonth() + 1) + '-' + (dateObj.getDate() + 1);
  db.query(`
      INSERT INTO articles (name, title, date, abstract, content)
      VALUES ('${name}', '${title}', '${date}', '${abstract}', '${content}');
  `,(err,result) => {
    if(err){
      res.status(500).json({ message: err });
    }else{
      console.log(result);
      res.status(200).json({ message: 'success' });
    }
  });
}

export default ArticlesHandler;
