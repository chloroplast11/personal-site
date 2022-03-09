import Image from 'next/image';
import {  EditorState, AtomicBlockUtils } from "draft-js";

const MediaComponent = ({contentState, block}) => {
  try{
    const entity = contentState.getEntity(block.getEntityAt(0));
    console.log(entity);
    const { src } = entity.getData();    // 取出图片的地址
    const { width, height } = getQueryVariable(src);
    return (
      <>
        <Image src={src} width={width} height={height}></Image>
      </>
    )
  }catch(e){
    return <></>
  }


}

function getQueryVariable(url){
  let obj = {
    width: 300,
    height: 300
  };
  let parastr = url.split("?")[1];
  if(!parastr){return obj}
  var arr = parastr.split("&");
  for (var i = 0; i < arr.length; i++) {
    obj[arr[i].split("=")[0]] = arr[i].split("=")[1];
  }
  return obj;
}

export default MediaComponent;

export const onAddImg = (editorState, setEditorState, src) => {
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