import '../styles/globals.scss';
import '../styles/article.scss';
import '../styles/highlight.css';
import '../styles/rich-editor.scss';
import Layout from '../components/layout';

function MyApp({ Component, pageProps }) {

  const getLayout = Component.getLayout || ((page) => (<Layout>{page}</Layout>));
  return getLayout(<Component {...pageProps} />)
}

export default MyApp
