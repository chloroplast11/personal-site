import React from 'react';
import AvatarSrc from '../public/logo192.png';
import Link from 'next/link';
import Image from 'next/image';

export default function Layout({children}) {
  return (
    <div className='index-wrapper'>
      <nav>
        <Image src={AvatarSrc}></Image>

        <h5>Chuck Chen</h5>

        <p>Passionate software developer. Learning something new each day. Writing code at WeVideo. Trainer and occasional speaker.</p>
      
        <ul>
          <li>
            <Link href='/articles'>
              Articles
            </Link>
          </li>
          <li>
            <Link href='/about'>
              About
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
