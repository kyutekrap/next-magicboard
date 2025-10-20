'use client';

import { getSessionId } from "@/common";
import Authenticate from "@/view/Authenticate";
import Home from "@/view/Home";
import { useEffect, useState } from "react";


export default function Page() {
  const [hasUser, setHasUser] = useState<boolean | null>(null);
  
  useEffect(() => {
    if (!!getSessionId()) setHasUser(true);
    else setHasUser(false);
  }, []);

  return ( hasUser === true ? (<Home />) : hasUser === false ? (<Authenticate />) : null );
}