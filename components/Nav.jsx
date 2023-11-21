'use client';

import { useSession, signIn, signOut } from 'next-auth/react';

const Nav = () => {
  const { data: session, status } = useSession();
  return (
    <div className="w-[90%] p-2 ">
      <div className="w-[95%] m-auto flex p-4 justify-between items-center">
        <h1 className="text-[#e92424]">ClickBuy</h1>
        {session ? <h1>SignOut</h1> : <h1>SignIn</h1>}
      </div>
    </div>
  );
};

export default Nav;
