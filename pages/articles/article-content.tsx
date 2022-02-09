import React, { ReactElement, useImperativeHandle, useRef } from 'react';
import ReactDOM from 'react-dom'

export default function ArticleContent(props) {

  // 指针所在元素
  let pointElement = null;

  const onRootClick = (event) => {
    if(event.target.id != 'editor'){
      console.log('aclick', event);
      pointElement = event.target;
    }
  }

  const changeTitle = () => {
    console.log("changeTitle");
    if(pointElement){
      const h1 = React.createElement('h2', null, pointElement);
      console.log(h1);
      console.log(pointElement.parentNode);
      ReactDOM.render(h1, document.getElementById('__next'));
    }
  }

  useImperativeHandle(props.onRef, () => {
    return {
      changeTitle,
    };
  });

  return (
    <>
      <h1 className='title'>Creating a toast service with Angular CDK</h1>

      <div suppressContentEditableWarning contentEditable='true' onClick={onRootClick} id='editor'>
        <p><img src="https://images.unsplash.com/photo-1514464750060-00e6e34c8b8c?ixlib=rb-1.2.1&amp;ixid=eyJhcHBfaWQiOjEyMDd9&amp;auto=format&amp;fit=crop&amp;w=1267&amp;q=80" alt="person holding phone"></img></p>
      
      
        <h2>一级标题</h2>
        <h3>二级标题</h3>

        <p>
          Angular Material is a great material UI design components library for your Angular applications. All the common parts needed to create components, things like layout, accessibility, common components like grid or tree have been isolated inside the CDK (Component Development Kit).
        </p>
      </div>
    </>
  );
}


