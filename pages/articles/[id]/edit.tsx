import Link from 'next/link';
import React, { ReactElement, useState } from 'react';
import { convertFromRaw } from "draft-js";
import "draft-js/dist/Draft.css";
import { Article } from '../../../model/article';
import Modal from '../../../components/modal';
import { GetStaticProps } from 'next'
import NoSsr from '../../../components/nossr';
import RichEditor from '../../../components/rich-editor/editor';

const Edit = ({article}: {article: Article}) => {

  let contentState;
  if(article.content){
    contentState = convertFromRaw(JSON.parse(article.content));
  }

  const richRditor = React.useRef(null);

  const [title, setTitle] = useState(article.title);
  const [name, setName] = useState(article.name);
  const [abstract, setAbstract] = useState(article.abstract);
  const [uploadImgModalVisible, setUploadImgModalVisible] = useState(false);
  const [addLinkModalVisible, setAddLinkModalVisible] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  // 保存文章
  const save = () => {
    const content = richRditor.current.getContent();
    const data = {
      name: name,
      title: title,
      abstract: abstract,
      content: JSON.stringify(content)
    }
    let url = 'http://localhost:3000/api/articles';
    if(article.id){
      url += '/' + (article.id)
    }
    fetch(url,{
      method: 'POST',
      body: JSON.stringify(data),
      headers:{
        'Content-Type':'application/json;charset=UTF-8'
      },
    }).then((r) => {
      if(r.status == 200){
        alert('保存成功！');
      }else{
        alert('保存失败！');
      }
    })
  }

  // 保存图片
  const saveImg = () => {
    const file = (document.getElementById('file-input') as any).files[0];
    if(file){
      const form = new FormData();
      form.append('file', file);
      fetch('http://localhost:3000/api/articles/img', {method: 'POST', body: form}).then(r => r.json()).then(r => {
        if(r.data){
          setUploadImgModalVisible(false);
          richRditor.current.addImg(r.data);
        }
      })
    }
  }

  // 添加链接
  const addLink = () => {
    richRditor.current.addLink(linkUrl, linkText);
    setAddLinkModalVisible(false);
  }

  return (
    <main id='article'>
      {uploadImgModalVisible && ( 
        <Modal setVisibleState={setUploadImgModalVisible} onSave={saveImg}>
          <input 
            type='file' 
            accept="image/png, image/jpeg"
            id='file-input'></input>
        </Modal>
      )}
      {addLinkModalVisible && ( 
        <Modal setVisibleState={setAddLinkModalVisible} onSave={addLink}>
          <input type='text' placeholder='链接地址' value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)}></input>
          <br></br>
          <input type='text' placeholder='显示文字' value={linkText} onChange={(e) => setLinkText(e.target.value)}></input>
        </Modal>
      )}
      <aside>
        <Link href='/articles'>
          <a className='tag-link'>All Articles</a>
        </Link>
      </aside>
      <article>
        <div className='editor-wrapper'>
          <textarea 
            className='title-editor' 
            rows={1} 
            placeholder='请在此输入标题' 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}>
          </textarea>
          <NoSsr>
            <RichEditor 
              contentState={contentState} 
              ref={richRditor}
              onAddImg={() => setUploadImgModalVisible(true)}
              onAddLink={() => setAddLinkModalVisible(true)}></RichEditor>
          </NoSsr>
          <div className='bottom'>
            文章名称：
            <input placeholder='请在此输入名称' value={name} onChange={(e) => setName(e.target.value)} className='input'/>
            文章摘要：
            <textarea 
              className='abstract-editor'
              placeholder='请在此输入摘要' 
              rows={6} 
              value={abstract} 
              onChange={(e) => setAbstract(e.target.value)}>
            </textarea>
          </div> 
        </div>
        <button onClick={save}>save</button>
      </article>
    </main>
    
  );
}

export default Edit;


Edit.getLayout = function getLayout(page: ReactElement){
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

export const getStaticProps: GetStaticProps = async ({params}) => {
  let data: Article;
  const res = await fetch(`http://localhost:3000/api/articles/${params.id}`, {method: 'GET'});
  
  if(res.status == 200){
    data = await res.json();
  }else{
    data = {
      id: null,
      name: '',
      title: '',
    }
  }
  return {
    props: {
      article: data
    }
  }
}

