import Link from 'next/link';
import React, { ReactElement, useEffect, useState } from 'react';
import { BlockTypes, InlineTypes } from '../../model/editor';
import { Editor, EditorState, RichUtils, getDefaultKeyBinding, convertToRaw } from "draft-js";
import NoSsr from '../../components/nossr';
import "draft-js/dist/Draft.css";


export default function Article() {
  
  const [editorState, setEditorState] = useState(() => 
    EditorState.createEmpty() 
  );

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

  const editor = React.useRef(null);
  function focusEditor() {
    editor.current.focus();
    checkTypesStatus();
  }

  function preventLoseFocus(event){
    event.preventDefault();
    return false;
  }

  function save(){
    console.log(convertToRaw(editorState.getCurrentContent()));
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
          {blockTypes.map(item => 
            <li onClick={() => toggleBlockType(item)} onMouseDown={preventLoseFocus} key={item.key} className={item.active ? 'active' : ''}>
              <i className={"iconfont " + item.icon}></i>
            </li>
          )}
        </ul>
      </aside>
      <article className='article-content'>
        <div className='editor-wrapper'>
          <textarea className='title-editor' rows={1} placeholder='请在此输入标题'></textarea>
          <div onClick={focusEditor}>
            <NoSsr>
              <Editor
                ref={editor}
                editorState={editorState}
                onChange={setEditorState}
                keyBindingFn={keyBindingFn}
                handleKeyCommand={handleKeyCommand}
                blockStyleFn={myBlockStyleFn}
                placeholder="请输入正文"
              />
            </NoSsr>
          </div>
        </div>
        <button onClick={save}>save</button>
      </article>
    </main>
    
  );
}

Article.getLayout = function getLayout(page: ReactElement){
  return <>{page}</>;
}

