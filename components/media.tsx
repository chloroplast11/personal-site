import Image from 'next/image';
import {  EditorState, AtomicBlockUtils } from "draft-js";

const MediaComponent = ({contentState, block}) => {
  const entity = contentState.getEntity(block.getEntityAt(0));
  const { src } = entity.getData();    // 取出图片的地址
  const type = entity.getType();  // 判断 entity 的 type 的
  return (
    <>
      <Image src={src} width={300} height={300}></Image>
    </>
  )
}

export default MediaComponent;

export const onAddImg = (editorState, setEditorState) => {
  const contentState = editorState.getCurrentContent();
  let src="https://cdn.wwads.cn/creatives/CpiLPQKm8xTHSCGvyMOQQ6lrIc6Oti2WricDsnJ0.png";
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