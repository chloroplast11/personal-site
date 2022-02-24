import React, { Ref, useImperativeHandle, useState } from "react";
import { Editor, EditorState, RichUtils, Modifier, getDefaultKeyBinding, convertToRaw, AtomicBlockUtils } from "draft-js";
import "draft-js/dist/Draft.css";
import { BlockTypes, InlineTypes, otherTypes } from "../../model/editor";
import MediaComponent from "../media";
import { createLinkDecorator } from "../link";

const RichEditor = ({contentState, onAddImg, onAddLink}, ref: Ref<any>) => {

  const [inlineTypes, setInlineTypes] = useState(InlineTypes.map(item => ({...item, active: false})));
  const [blockTypes, setBlockTypes] = useState(BlockTypes.map(item => ({...item, active: false})));
  
  const decorator = createLinkDecorator();
  const [editorState, setEditorState] = useState(() => 
    contentState ? EditorState.createWithContent(contentState, decorator) : EditorState.createEmpty()
  );

  const editorRef = React.useRef(null);
  const btnsRef = React.useRef(null);

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

  const triggerOtherType = (item) => {
    if(item.key == 'img'){
      onAddImg();
    }else if(item.key == 'link'){
      onAddLink();
    }
  }

  const checkTypesStatus = () => {
    const blockType = RichUtils.getCurrentBlockType(editorState);
    setBlockTypes(BlockTypes.map(item => ({...item, active: blockType == item.key})));
    const inlineKeys = [...editorState.getCurrentInlineStyle()];
    setInlineTypes(inlineTypes.map(item => ({...item, active: inlineKeys.includes(item.key)})));
  }

  const focusEditor = () => {
    editorRef.current.focus();
    checkTypesStatus();
  }

  const myBlockStyleFn = (contentBlock) => {
    const type = contentBlock.getType();
    if(type === 'unstyled'){
      return 'Editable-unstyled';
    }
  }

  const myBlockRenderer = (contentBlock) => {
    const type = contentBlock.getType();
    if(type === 'atomic'){
      return {
        component: MediaComponent,
        editable: false
      };
    }
  }

  const keyBindingFn = (event) => {
    const code = event.code;
    if(code === 'Enter' || code === 'Backspace' || code.indexOf('Arrow') !== -1){
      checkTypesStatus();
    }else if(code === 'Tab'){
      const selection = editorState.getSelection();
      if(selection.isCollapsed()){
        const currentContent = editorState.getCurrentContent();
        const tabEntity = Modifier.insertText(currentContent, selection, '  ');
        const newState = EditorState.createWithContent(tabEntity);
        setEditorState(newState);
      }
      event.preventDefault();
    }
    return getDefaultKeyBinding(event);
  }

  const handleKeyCommand = (command: string): string => {
    if(command == 'split-block' && RichUtils.getCurrentBlockType(editorState) == 'code-block'){
      const newEditorState = RichUtils.insertSoftNewline(editorState);
      setEditorState(newEditorState);
      return 'handled'
    }
  }

  const preventLoseFocus = (event) => {
    event.preventDefault();
    return false;
  }

  // 暴露的方法
  useImperativeHandle(ref, () => ({
    getContent,
    addImg,
    addLink
  }))

  // 获取内容
  const getContent = () => {
    const content = convertToRaw(editorState.getCurrentContent());
    // delete content.entityMap['0'];
    content.blocks.map(item => {
      if(item.text){
        item.text = item.text.replace(/\n/g, '\\n');
      }
    })
    console.log(content);
    return content;
  }

  // 添加图片
  const addImg = (src: string):void => {
    const contentState = editorState.getCurrentContent();
    // 使用 `contentState.createEntity` 创建一个 `entity`，指定其 `type` 为 `image`
    const contentStateWithEntity = contentState.createEntity(
      'image',
      'IMMUTABLE',
      { src }
    );
  
    // 获取新创建的 `entity` 的 key
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  
    // 用 `EditorState.set()`  来建立一个带有这个 `entity` 的新的 EditorState 
    const newEditorState = EditorState.set(
      editorState,
      { currentContent: contentStateWithEntity });
  
    // 利用`AtomicBlockUtils.insertAtomicBlock` 来插入一个新的 `block`
    setEditorState(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' '));
  }

  // 添加链接
  const addLink = (linkUrl: string, linkText: string):void => {
    if(!linkUrl) { return; }
    if(!linkUrl.startsWith('http')){
      linkUrl = 'http://' + linkUrl;
    }
    const decorator = createLinkDecorator();
    const selection = editorState.getSelection();
    if (linkText) {
      const currentContent = editorState.getCurrentContent();
      currentContent.createEntity("LINK", "MUTABLE", {
          url: linkUrl,
      });
      const entityKey = currentContent.getLastCreatedEntityKey();
      let textWithEntity;
      if(selection.isCollapsed()){
        textWithEntity = Modifier.insertText(
          currentContent,
          selection,
          linkText,
          null,
          entityKey
        );
      }else{
        textWithEntity = Modifier.replaceText(
          currentContent,
          selection,
          linkText,
          null,
          entityKey
        );
      }
      const newState = EditorState.createWithContent(textWithEntity, decorator);
      setEditorState(newState);
    }
  };

  const [btnsStyle, setBtnsStyle] = useState(null);

  document.addEventListener('scroll', (e) => {
    if(btnsRef && btnsRef.current){
      const el = btnsRef.current;
      const { top, left } = el.getBoundingClientRect();
      if(top < 1){
        setBtnsStyle({
          position: 'fixed',
          top: '10px',
          left: left + 'px'
        });
        // el.style.position = 'fixed';
        // el.style.top = '10px';
        // el.style.left = left + 'px';
      }else{
        setBtnsStyle(null);
      }
      // else{
      //   el.style.position = 'absolute';
      //   el.style.top = null;
      //   el.style.left = null;
      // }
    }
  })

  return (
    <>
      <div className='draft-rich-editor' onClick={focusEditor}>
        <ul className="editor-btns" ref={btnsRef} style={btnsStyle}>
          {inlineTypes.map(item => 
            <li onClick={() => toggleInlineStyle(item)} 
                key={item.key} 
                onMouseDown={preventLoseFocus} 
                className={item.active ? 'active' : ''} 
                title={item.label} >
              <i className={"iconfont " + item.icon}></i>
            </li>
          )}
          {otherTypes.map(item => 
            <li onClick={() => triggerOtherType(item)}
                key={item.key} 
                onMouseDown={preventLoseFocus} 
                title={item.label}>
              <i className={"iconfont " + item.icon}></i>
            </li>
          )}
          {blockTypes.map(item => 
            <li onClick={() => toggleBlockType(item)} 
                key={item.key} 
                onMouseDown={preventLoseFocus} 
                className={item.active ? 'active' : ''} 
                title={item.label}>
              <i className={"iconfont " + item.icon}></i>
            </li>
          )}
        </ul>
        <Editor
          ref={editorRef}
          editorState={editorState}
          onChange={setEditorState}
          keyBindingFn={keyBindingFn}
          handleKeyCommand={handleKeyCommand}
          blockStyleFn={myBlockStyleFn}
          blockRendererFn={myBlockRenderer}
          placeholder="请输入正文"
        />
      </div>
    </>

  );
}

export default React.forwardRef(RichEditor);