import Link from 'next/link';
import React, { ReactElement, useEffect, useState } from 'react';
import { BlockTypes, InlineTypes, otherTypes } from '../../../model/editor';
import { Editor, EditorState, RichUtils, getDefaultKeyBinding, convertToRaw, convertFromRaw, AtomicBlockUtils } from "draft-js";
import NoSsr from '../../../components/nossr';
import "draft-js/dist/Draft.css";
import { Article } from '../../../model/article';
import MediaComponent from '../../../components/media';

const Edit = ({article}: {article: Article}) => {

  let contentState;
  if(article.content){
    contentState = convertFromRaw(JSON.parse(article.content));
  }

  const [editorState, setEditorState] = useState(() => 
    contentState ? EditorState.createWithContent(contentState) : EditorState.createEmpty() 
  );

  const [title, setTitle] = useState(article.title);
  const [name, setName] = useState(article.name);
  const [abstract, setAbstract] = useState(article.abstract);

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

  // 插入图片或链接
  const triggerOtherType = (item) => {
    if(item.key == 'img'){
      const contentState = editorState.getCurrentContent();
      let src="https://cdn.wwads.cn/creatives/CpiLPQKm8xTHSCGvyMOQQ6lrIc6Oti2WricDsnJ0.png";
      // 使用 `contentState.createEntity` 创建一个 `entity`，指定其 `type` 为 `image`
      const contentStateWithEntity = contentState.createEntity(
        'image',
        'IMMUTABLE',
        { src }
      );

      console.log(contentStateWithEntity.getEntityMap());

      // 获取新创建的 `entity` 的 key
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();


      // 用 `EditorState.set()`  来建立一个带有这个 `entity` 的新的 EditorState 
      const newEditorState = EditorState.set(
        editorState,
        { currentContent: contentStateWithEntity });

      // 利用`AtomicBlockUtils.insertAtomicBlock` 来插入一个新的 `block`
      setEditorState(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' '));
      
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

  // 保存文章
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

  return (
    <main id='article'>
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

