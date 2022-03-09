import Link from 'next/link';
import React, { ReactElement, useState } from 'react';
import ArticleComponent from '../../../components/article';
import BackStageLayout from '../../../components/backstage-layout';
import { Article } from '../../../model/article';

const Articles = ({articles}: {articles:Array<Article>}) => {

  const [myArticles, setArticles] = useState(articles);

  const changePublishStatus = (item: Article) => {
    const data = {
      publishStatus: item.publishStatus == 1 ? 2 : 1,
    }
    let url = 'http://localhost:3000/api/articles/' + item.id;
    fetch(url,{
      method: 'PATCH',
      body: JSON.stringify(data),
      headers:{
        'Content-Type':'application/json;charset=UTF-8'
      },
    }).then((r) => {
      if(r.status == 200){
        item.publishStatus = item.publishStatus == 1 ? 2 : 1;
        const newArticles = articles.map(item => item);
        setArticles(newArticles);
        alert(`文章已${item.publishStatus == 2 ? '发布' : '取消发布'}！`);
      }else{
        alert('操作失败！');
      }
    })
  }

  return (
    <>
      <Link href={'/backstage/articles/1'}>
        <button style={{'marginBottom': '30px'}}>创建文章</button>
      </Link>
      {myArticles.map((item, index) => (
        <div key={index}>
          <ArticleComponent  item={item} noRead={true}/>
          <div  style={{marginBottom: '20px'}}>
            <Link href={`/backstage/articles/${item.name}`}>
              <button style={{marginRight: '20px'}}>编辑</button>
            </Link>
            <button onClick={() => changePublishStatus(item)}>{item.publishStatus == 1 ? '发布' : '取消发布'}</button>
          </div>
        </div>
      ))}
    </>
  );
}

export default Articles;

Articles.getLayout = function getLayout(page: ReactElement){
  return <BackStageLayout>{page}</BackStageLayout>;
}

export async function getStaticProps() {
  let data: Array<Article> = [];
  const res = await fetch('http://localhost:3000/api/articles?status=3', {method: 'GET'});
  
  if(res.status == 200){
    data = await res.json();
  }
  console.log(data);
  return {
    props: {
      articles: data
    }
  }
}

