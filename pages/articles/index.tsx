import React from 'react';
import Article from '../../components/article';

export default function Articles() {
  return (
    Array.from({length: 20}).map((item, index) => <Article key={index} />)
  );
}

