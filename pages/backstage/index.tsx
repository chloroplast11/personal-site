import Link from "next/link";
import { ReactElement } from "react";

const backStatgLogin = () => {

  const style = {
    'display': 'flex',
    'alignItems': 'center',
    'justifyContent': 'center',
    'flex-direction': 'column',
    'height': '500px'
  }
  return (
    <div style={style}>
      <h3>登录</h3>
      <div>
        账号：<input type='text'/>
      </div>
      <div>
        密码：<input type='password'/>
      </div>
      <div>
        <Link href={'/backstage/articles'}>
          <button>登录</button>
        </Link>
      </div>
    </div>
  )
}

export default backStatgLogin;


backStatgLogin.getLayout = function getLayout(page: ReactElement){
  return <>{page}</>;
}