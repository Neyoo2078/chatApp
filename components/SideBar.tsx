import { getServerSession } from 'next-auth';
import { getAllUsers, GetUserByEmail } from '@/lib/Actions/UserActions';
import SideBarClient from './SideBarClient';
import { authOptions } from '@/lib/auth';
import { getConatctFromMessage } from '@/lib/Actions/MessageActions';

const SideBar = async () => {
  const session = await getServerSession(authOptions);

  const res = await GetUserByEmail({ email: session?.user?.email });
  const GetCUser = JSON.parse(res);
  const Ares = await getAllUsers({ email: session?.user?.email });
  const Auser = JSON.parse(Ares);
  const Contacts = await getConatctFromMessage({ userid: GetCUser?._id });
  console.log({ env: process.env.NEXTAUTH_URL_INTERNAL });

  return (
    <div className=" md:h-screen   h-screen relative overflow-y-auto flex flex-col  border-[1px]  border-[#b4b4b4]  w-full lg:w-[400px] bg-[#FAF9F6]">
      <SideBarClient GetCUser={GetCUser} Auser={Auser} />
    </div>
  );
};

export default SideBar;
