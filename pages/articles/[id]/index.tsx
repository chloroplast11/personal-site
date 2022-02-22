import Link from 'next/link';
import React, { ReactElement } from 'react';
import { convertFromRaw } from "draft-js";
import "draft-js/dist/Draft.css";
import { Article } from '../../../model/article';
import { stateToHTML } from 'draft-js-export-html';
import Head from 'next/head';
const hljs = require('highlight.js');

export default function ArticleDetails({article}: {article: Article}) {

  console.log(article);

  let html;
  const options = {
    entityStyleFn: (entity) => {
      const entityType = entity.get('type').toLowerCase();
      if (entityType === 'link') {
        const data = entity.getData();
        return {
          element: 'a',
          attributes: {
            href: data.url,
            target: '_blank'
          },
          style: {
            color: '#5d93ff',
            textDecoration: 'underline'
          },
        };
      }
    },
    blockRenderers: {
      'code-block': (block) => {
        const code = hljs.highlight(block.getText(), {language: 'javascript'}).value;
        return `<pre><code>${code}</code></pre>`;
      },
    },
  };
  
  if(article.content){
    const contentState = convertFromRaw(JSON.parse(article.content));
    html = stateToHTML(contentState, options);
  }

  return (
    <>
      <Head>
        <title>{article.name}</title>
        <meta name='description' content={article.abstract}></meta>
      </Head>
      <main id='article'>
        <aside>
          <Link href='/articles'>
            <a className='tag-link'>All Articles</a>
          </Link>
        </aside>
        <article className='article-content'>
          <h1 className='title'>{article.title}</h1>
          <div className='abstract'>
            <h2>摘要</h2>
            <p>{article.abstract}</p>
          </div>
          <div dangerouslySetInnerHTML={{__html:html}}></div>
        </article>
      </main>
    </>
    
  );
}

ArticleDetails.getLayout = function getLayout(page: ReactElement){
  return <>{page}</>;
}

export async function getStaticPaths() {
  return {
    paths: [
      {
        params: { id: 'ssr_in_nextjs' }
      },
      {
        params: { id: 'name2' }
      },
      {
        params: { id: 'name3' }
      }
    ],
    fallback: 'blocking'
  }
}

export async function getStaticProps({params}) {
  let data: Article;
  const res = await fetch(`http://localhost:3000/api/articles/${params.id}`, {method: 'GET'});
  
  if(res.status == 200){
    data = await res.json();
  }else{
    return {
      notFound: true
    }
  }
  return {
    props: {
      article: data
    }
  }
}

