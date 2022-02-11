import Link from 'next/link';
import React, { ReactElement, useEffect, useState } from 'react';
import { Editor, EditorState, convertFromRaw } from "draft-js";
import "draft-js/dist/Draft.css";
import { Article } from '../../../model/article';
import MediaComponent from '../../../components/media';


export default function ArticleDetails({article}: {article: Article}) {

  let contentState;
  if(article.content){
    contentState = convertFromRaw(JSON.parse(article.content));
  }
  
  const [editorState, setEditorState] = useState(() => 
    contentState ? EditorState.createWithContent(contentState) : EditorState.createEmpty() 
  );

  function myBlockRenderer(contentBlock){
    const type = contentBlock.getType();
    if(type === 'atomic'){
      return {
        component: MediaComponent,
        editable: false
      };
    }
  }

  return (
    <main id='article'>
      <aside>
        <Link href='/articles'>
          <a className='tag-link'>All Articles</a>
        </Link>
      </aside>
      <article className='article-content'>
        <h1 className='title'>{article.title}</h1>
        <div>
          <Editor
            editorState={editorState}
            readOnly={true}
            blockRendererFn={myBlockRenderer}
          />
        </div>
      </article>
    </main>
    
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
  }
  return {
    props: {
      article: data
    }
  }
}

