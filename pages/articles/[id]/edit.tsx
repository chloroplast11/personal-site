import Link from 'next/link';
import React, { ReactElement, useEffect, useState } from 'react';
import { BlockTypes, InlineTypes, otherTypes } from '../../../model/editor';
import { Editor, EditorState, RichUtils, getDefaultKeyBinding, convertToRaw, convertFromRaw, AtomicBlockUtils, Entity } from "draft-js";
import NoSsr from '../../../components/nossr';
import "draft-js/dist/Draft.css";
import { Article } from '../../../model/article';
import MediaComponent from '../../../components/media';
import { createLinkDecorator, onAddLink } from '../../../components/link';
import Modal from '../../../components/modal';

const Edit = ({article}: {article: Article}) => {

  // initiate editorState
  let contentState;
  if(article.content){
    contentState = convertFromRaw(JSON.parse(article.content));
  }
  const decorator = createLinkDecorator();
  const [editorState, setEditorState] = useState(() => 
    contentState ? EditorState.createWithContent(contentState, decorator) : EditorState.createEmpty() 
  );

  const [title, setTitle] = useState(article.title);
  const [name, setName] = useState(article.name);
  const [abstract, setAbstract] = useState(article.abstract);
  const [uploadImgModalVisible, setUploadImgModalVisible] = useState(false);

  const [inlineTypes, setInlineTypes] = useState(InlineTypes.map(item => ({...item, active: false})));
  const [blockTypes, setBlockTypes] = useState(BlockTypes.map(item => ({...item, active: false})));

  const toggleInlineStyle = (item) => {
    item.active = !item.active;
    setInlineTypes(inlineTypes);
    let state = RichUtils.toggleInlineStyle(editorState, item.key);
    setEditorState(state);
  }

  const toggleBlockType = (item) => {
    item.active = !item.active;
    setBlockTypes(blockTypes);
    let state = RichUtils.toggleBlockType(editorState, item.key);
    setEditorState(state);
  }

  // insert image or link
  const triggerOtherType = (item) => {
    if(item.key == 'img'){
      // onAddImg(editorState, setEditorState);
      setUploadImgModalVisible(true);
    }else if(item.key == 'link'){
      onAddLink(editorState, setEditorState);
    }
  }

  const editor = React.useRef(null);
  function focusEditor() {
    editor.current.focus();
    checkTypesStatus();
  }

  function preventLoseFocus(event){
    event.preventDefault();
    return false;
  }

  // save article
  function save(){
    const content = convertToRaw(editorState.getCurrentContent());
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

  function keyBindingFn(event){
    const code = event.code;
    if(code === 'Enter' || code === 'Backspace' || code.indexOf('Arrow') !== -1){
      checkTypesStatus();
    }
    return getDefaultKeyBinding(event);
  }

  function checkTypesStatus(){
    const blockType = RichUtils.getCurrentBlockType(editorState);
    setBlockTypes(BlockTypes.map(item => ({...item, active: blockType == item.key})));
    const inlineKeys = [...editorState.getCurrentInlineStyle()];
    setInlineTypes(inlineTypes.map(item => ({...item, active: inlineKeys.includes(item.key)})));
  }

  function myBlockStyleFn(contentBlock) {
    const type = contentBlock.getType();
    if (type === 'code-block') {
      return 'cyhCodeBlock';
    }else if(type === 'unstyled'){
      return 'Editable-unstyled';
    }
  }

  function myBlockRenderer(contentBlock){
    const type = contentBlock.getType();
    if(type === 'atomic'){
      return {
        component: MediaComponent,
        editable: false
      };
    }
  }

  function handleKeyCommand(command: string): string{
    if(command == 'split-block' && RichUtils.getCurrentBlockType(editorState) == 'code-block'){
      const newEditorState = RichUtils.insertSoftNewline(editorState);
      setEditorState(newEditorState);
      return 'handled'
    }
  }

  function saveImg(){
    const file = (document.getElementById('file-input') as any).files[0];
    if(file){
      const form = new FormData();
      form.append('file', file);
      fetch('http://localhost:3000/api/articles/img', {method: 'POST', body: form}).then(r => {
        console.log(r);
      })
    }
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
      <aside>
        <Link href='/articles'>
          <a className='tag-link'>All Articles</a>
        </Link>

        <ul>
          {inlineTypes.map(item => 
            <li onClick={() => toggleInlineStyle(item)} onMouseDown={preventLoseFocus} key={item.key} className={item.active ? 'active' : ''}>
              <i className={"iconfont " + item.icon}></i>
            </li>
          )}
          {otherTypes.map(item => 
            <li onClick={() => triggerOtherType(item)} onMouseDown={preventLoseFocus} key={item.key}>
              <i className={"iconfont " + item.icon}></i>
            </li>
          )}
          {blockTypes.map(item => 
            <li onClick={() => toggleBlockType(item)} onMouseDown={preventLoseFocus} key={item.key} className={item.active ? 'active' : ''}>
              <i className={"iconfont " + item.icon}></i>
            </li>
          )}
        </ul>
      </aside>
      <article className='article-content'>
        <div className='editor-wrapper'>
          <textarea 
            className='title-editor' 
            rows={1} 
            placeholder='请在此输入标题' 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}>
          </textarea>
          <div onClick={focusEditor}>
            <NoSsr>
              <Editor
                ref={editor}
                editorState={editorState}
                onChange={setEditorState}
                keyBindingFn={keyBindingFn}
                handleKeyCommand={handleKeyCommand}
                blockStyleFn={myBlockStyleFn}
                blockRendererFn={myBlockRenderer}
                placeholder="请输入正文"
              />
            </NoSsr>
          </div>
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

export async function getStaticProps({params}) {
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

