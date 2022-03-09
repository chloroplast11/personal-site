import React from 'react';
import Link from 'next/link';

export default function BackStageLayout({children}) {
  return (
    <div className='index-wrapper'>
      <nav>     
        <ul>
          <li>
            <Link href='/backstage/articles'>
              Articles
            </Link>
          </li>
          <li>
            <a href="">Contact</a>
          </li>
        </ul>
      </nav>

      <main>
        {children}
      </main>
      
    </div>
  );
}
