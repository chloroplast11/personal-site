import Link from 'next/link';
import React from 'react';
import styles from '../styles/article.module.scss';

export default function Article() {
  return (
    <div className={styles.article}>
      <div className={styles.titleHead}>
        <time dateTime='2020-08-01'>AUGUST 2020</time>
        <span className={styles.tag}>ANGULAR</span>
      </div>
      <h2 className={styles.title}>
        <Link href='/articles/1'>
          <a className={styles.titleLink}>Handling Observables in a LitElement component</a>
          </Link>
      </h2>
      <p className={styles.description}>
        In this post, we are going to explore how to handle Observables inside a LitElement component. What options we have for this and how I've created a generic solution. It will handle subscribing to a stream, with some extra features and built in functionality.
      </p>
      <Link href='/articles/1'>
        <a className={styles.readMore}>Read</a> 
      </Link>
    </div>
  )
}
