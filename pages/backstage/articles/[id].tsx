import Link from 'next/link';
import React, { ReactElement, useEffect, useState } from 'react';
import { ContentState, convertFromRaw } from "draft-js";
import "draft-js/dist/Draft.css";
import { Article } from '../../../model/article';
import Modal from '../../../components/modal';
import { GetStaticProps } from 'next'
import NoSsr from '../../../components/nossr';
import RichEditor, { RichEditorRef } from '../../../components/rich-editor/editor';

const Edit = ({article}: {article: Article}) => {

  let contentState: ContentState;
  if(article.content){
    contentState = convertFromRaw(JSON.parse(article.content));
  }

  const richRditor: {current: RichEditorRef} = React.useRef(null);

  const [title, setTitle] = useState(article.title);
  const [name, setName] = useState(article.name);
  const [abstract, setAbstract] = useState(article.abstract);
  const [uploadImgModalVisible, setUploadImgModalVisible] = useState(false);
  const [addLinkModalVisible, setAddLinkModalVisible] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [tagList, setTagList] = useState(article.tagList);
  const [allTags, setAllTags] = useState([]);
  const [tagId, setTagId] = useState('1');
  const [newTagName, setNewTagName] = useState('');

  // 初始化所有标签
  useEffect(() => {
    getAllTags();
  }, [])

  const getAllTags = () => {
    fetch(`http://localhost:3000/api/tags`, {method: 'GET'}).then(r => r.json()).then(list => {
      setAllTags(list);
    })
  }

  // 给文章添加标签
  const addTag = () => {
    const data = { tagId };
    fetch(`http://localhost:3000/api/articles/${article.id}/tags`, 
      { 
        method: 'POST', 
        body: JSON.stringify(data),
        headers:{
          'Content-Type':'application/json;charset=UTF-8'
      }
    }).then(r => r.json()).then(r => {
      if(r.data){
        setTagList([...tagList, r.data])
      }
    });
  }

  // 删除标签
  const deleteTag = (tagId) => {
    fetch(`http://localhost:3000/api/articles/${article.id}/tags/${tagId}`, { method: 'DELETE' }).then(r => {
      if(r.status == 200){
        getAllTags();
        const arr = tagList.filter(item => item.id != tagId);
        setTagList(arr);
      }
    });
  }

  // 创建新标签
  const createTag = () => {
    const data = { tagName: newTagName };
    fetch(`http://localhost:3000/api/articles/${article.id}/tags`, 
      { 
        method: 'POST', 
        body: JSON.stringify(data),
        headers:{
          'Content-Type':'application/json;charset=UTF-8'
      }
    }).then(r => r.json()).then(r => {
      getAllTags();
      if(r.data){
        setTagList([...tagList, r.data])
      }
    });
  }

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
        <Link href='.'>
          <a className='tag-link'>返回</a>
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

        <div className='form-row'>
          <label>文章路由名称：</label>
          <input placeholder='请在此输入名称' value={name} onChange={(e) => setName(e.target.value)} className='input'/>
        </div>

        <button onClick={save} style={{margin: '20px 0 10px 0'}}>保存文章</button>

        <div className='form-row'>
          <label>添加标签：</label>
          <select onChange={($event) => setTagId($event.target.value)}>
            {
              allTags ? allTags.map(item => 
                <option key={item.id} value={item.id}>{item.name}</option>
              ) : ''
            }
          </select>
          <button onClick={addTag}>添加</button>
        </div>
        <div className='form-row'>
          <label>新增标签：</label>
          <input placeholder='请在此输入标签名称' value={newTagName} onChange={(e) => setNewTagName(e.target.value)}/>
          <button onClick={createTag}>创建</button>
        </div>
        <div className='tag-list'>
          {
            tagList ? tagList.map(item => 
              <div className='article-tag' key={item.id}>
                {item.name} <i className='iconfont icon-ICONbiaozhun_fuzhi-' onClick={() => deleteTag(item.id)}></i>
              </div>
            ) : '' 
          }
        </div>
        
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

