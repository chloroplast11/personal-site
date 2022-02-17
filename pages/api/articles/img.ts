import { NextApiHandler } from "next";
import { IncomingForm } from 'formidable'
const fs = require('fs');
const sizeOf = require('image-size');

export const config = {
  api: {
    bodyParser: false,
    sizeLimit: '30mb',
  },
}

export const ArticleImageHandler: NextApiHandler = async (req, res) => {
  const { method } = req;
  // res.status(200).json({message: __dirname});
  if(method == 'POST'){
    const data = (await new Promise((resolve, reject) => {
      const form = new IncomingForm();
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err)
        resolve({ fields, files })
      })
    }) as any);
    if(data.files && data.files.file){
      const { filepath, originalFilename} = data.files.file;
      fs.readFile(filepath, (err, data) => {
        //如果读取失败
        if (err) { res.status(500).json({message: 'Fail to upload', err: err}); return; }

        //声明图片名字为时间戳和随机数拼接成的，尽量确保唯一性
        const date = new Date();
        const time = date.getFullYear().toString() + (date.getMonth() + 1) + (date.getDate() + 1) + date.getHours() + date.getMinutes() + date.getSeconds();
        let ext = 'png';
        if(originalFilename && originalFilename.split('.')[1]){
          ext = originalFilename.split('.')[1];
        }
        //拼接成图片名
        const keepname = time + '.' + ext;
        const filePath = '/Applications/XAMPP/xamppfiles/htdocs/images/' + keepname;
        fs.writeFile(filePath, data, (err) => {
          const dimensions = sizeOf(filePath);
          if (err) { res.status(500).json({message: 'Fail to upload', err: err}); return; }
          res.status(200).json({ message: 'success', data: `http://localhost/images/${keepname}?width=${dimensions.width}&height=${dimensions.height}` })
        });
      });
    }else{
      res.status(500).json({message: data.err});
    }
  }else{
    res.status(200).json({message: 'cannot reponse to this http method'});
  }
  
}

export default ArticleImageHandler;