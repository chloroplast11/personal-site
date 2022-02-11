import Image from 'next/image';

const MediaComponent = (props) => {
  const entity = props.contentState.getEntity(props.block.getEntityAt(0));
  const { src } = entity.getData();    // 取出图片的地址
  const type = entity.getType();  // 判断 entity 的 type 的
  return (
    <>
      <Image src={src} width={300} height={300}></Image>
    </>
  )
}

export default MediaComponent;