import React from 'react';
import ArticleComponent from '../../components/article';
import { Article } from '../../model/article';

const Articles = ({articles}: {articles:Array<Article>}) => {
  return (
    articles.map((item, index) => <ArticleComponent key={index} item={item}/>)
  );
}

export default Articles;

export async function getStaticProps() {
  let data: Array<Article> = [];
  const res = await fetch('http://localhost:3000/api/articles', {method: 'GET'});
  
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

