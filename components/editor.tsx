import React, { useEffect, useState } from "react";
import { Editor, EditorState, RichUtils } from "draft-js";
import "draft-js/dist/Draft.css";
import NoSsr from "./nossr";
import { BlockTypes, InlineTypes } from "../model/editor";

export default function MyEditor() {
  
  const [editorState, setEditorState] = useState(() => 
    EditorState.createEmpty() 
  );

  useEffect(() => {

  }, [])

  const toggleInlineStyle = (e, style: string) => {
    e.preventDefault();
    let state = RichUtils.toggleInlineStyle(editorState, style);
    console.log(state);
    setEditorState(state);
  }

  const toggleBlockType = (e, style: string) => {
    e.preventDefault();
    let state = RichUtils.toggleBlockType(editorState, style);
    console.log(state);
    setEditorState(state);
  }

  const editor = React.useRef(null);
  function focusEditor() {
    editor.current.focus();
  }

  return (
    <>
      {InlineTypes.map(item => <button onClick={($event) => toggleInlineStyle($event, item.key)} key={item.key}>{item.label}</button>)}
      {BlockTypes.map(item => <button onClick={($event) => toggleBlockType($event, item.key)} key={item.key}>{item.label}</button>)}
      <div
        style={{ border: "1px solid black", minHeight: "6em", cursor: "text" }}
        onClick={focusEditor}
      >
        <NoSsr>
          <Editor
            ref={editor}
            editorState={editorState}
            onChange={setEditorState}
            placeholder="Write something!"
          />
        </NoSsr>
      </div>
    </>

  );
}