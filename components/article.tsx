import Link from 'next/link';
import React from 'react';
import { Article } from '../model/article';
import styles from '../styles/article.module.scss';

const monthObj = {
  0: '一月',
  1: '二月',
  2: '三月',
  3: '四月',
  4: '五月',
  5: '六月',
  6: '七月',
  7: '八月',
  8: '九月',
  9: '十月',
  10: '十一月',
  11: '十二月'
}

const ArticleComponent = ({item}:{item:Article}) => {
  let dateObj = new Date(item.date);
  const dateStr = monthObj[dateObj.getMonth()] + ' ' + dateObj.getFullYear();
  const date = dateObj.getFullYear + '-' + (dateObj.getMonth() + 1) + '-' + (dateObj.getDate() + 1);

  let tags: Array<string> = [];
  if(item.tags){
    tags = item.tags.split(',').map(item => item.toUpperCase());
  }
  return (
    <div className={styles.article}>
      <div className={styles.titleHead}>
        <time dateTime={date}>{dateStr}</time>
        {
          tags.map(item => <span className={styles.tag} key={item}>{item}</span>)
        }
      </div>
      <h2 className={styles.title}>
        <Link href={`/articles/${item.name}`}>
          <a className={styles.titleLink}>{item.title}</a>
        </Link>
      </h2>
      <p className={styles.description}>
        {item.abstract}
      </p>
      <Link href={`/articles/${item.name}`}>
        <a className={styles.readMore}>阅读</a> 
      </Link>
    </div>
  )
}

export default ArticleComponent;
