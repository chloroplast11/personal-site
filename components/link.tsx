import { CompositeDecorator, EditorState, Modifier } from "draft-js";


export const Link = ({ entityKey, contentState, children }) => {
  let { url } = contentState.getEntity(entityKey).getData();
  return (
      <a
        style={{ color: "#5d93ff", textDecoration: 'underline' }}
        href={url}
        target="_blank"
      >
        {children}
      </a>
  );
};

const linkStrategy = (contentBlock, callback, contentState) => {
  contentBlock.findEntityRanges((character) => {
    const entityKey = character.getEntity();
    return (
        entityKey !== null &&
        contentState.getEntity(entityKey).getType() === "LINK"
    );
  }, callback);
};

export const createLinkDecorator = () =>
  new  CompositeDecorator([{
    strategy: linkStrategy,
    component: Link
  }]
);

export const onAddLink = (editorState, setEditorState) => {
  let linkUrl = window.prompt("Add link http:// ");
  if(!linkUrl) { return; }
  const decorator = createLinkDecorator();
  const selection = editorState.getSelection();
  const displayLink = window.prompt("Display Text");
  if (displayLink) {
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
          displayLink,
          null,
          entityKey
        );
      }else{
        textWithEntity = Modifier.replaceText(
          currentContent,
          selection,
          displayLink,
          null,
          entityKey
        );
      }
      const newState = EditorState.createWithContent(textWithEntity, decorator);
      setEditorState(newState);
  }
};



