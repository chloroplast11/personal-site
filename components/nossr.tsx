import { FC, useEffect, useState } from "react";

export default function NoSsr(props) {
  const [mounted, setMounted] = useState(false);
  useEffect(()=>{
    setMounted(true);
  }, [])
  return <>
    { mounted ? props.children : null }
  </>
}