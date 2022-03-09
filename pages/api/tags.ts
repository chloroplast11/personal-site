import { NextApiHandler } from "next";
const db = require('./db');

const TagsHandler: NextApiHandler = (req, res) => {

  const { method } = req;

  if(method == 'GET'){
    get(res);
  }else{
    res.status(500).json({ message: 'cannot reponse to this http method' })
  }
  
}

// query one article
function get(res){
  db.query(`
    select * from tags
  `,(err,result) => {
    if(err){
      res.status(500).json({ message: err });
    }else{
      res.status(200).json(result);
    }
  });
}

export default TagsHandler;
