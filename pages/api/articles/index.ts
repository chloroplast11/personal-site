import { NextApiHandler } from "next";
const db = require('../db');

const ArticlesHandler: NextApiHandler = (req, res) => {
  const { method } = req;
  if(method == 'GET'){
    db.query(`
      select articles.*, GROUP_CONCAT(tags.name) as tags
      from articles 
      LEFT JOIN articles_tags on articles_tags.article_id = articles.id
      LEFT JOIN tags on articles_tags.tag_id = tags.id
      group by articles.id
    `,function(err,result){
      if(err){
        res.status(500).json({ message: err });
      }else{
        res.status(200).json(result);
      }
    });
  }else if(method == 'POST'){
    const { body } = req;
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
  }else{
    res.status(500).json({ message: 'cannot reponse to this method' })
  }
  
}

export default ArticlesHandler;
