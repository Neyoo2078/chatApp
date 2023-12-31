import { getServerSession } from 'next-auth';
import { getAllUsers, GetUserByEmail } from '@/lib/Actions/UserActions';
import SideBarClient from './SideBarClient';
import { authOptions } from '@/lib/auth';
import { getConatctFromMessage } from '@/lib/Actions/MessageActions';
import { useAppSelector, useAppDispatch } from '@/Redux/hooks';

const SideBar = async () => {
  const session = await getServerSession(authOptions);

  const res = await GetUserByEmail({ email: session?.user?.email });
  const GetCUser = JSON.parse(res);
  const Ares = await getAllUsers({ email: session?.user?.email });
  const Auser = JSON.parse(Ares);
  const Contacts = await getConatctFromMessage({ userid: GetCUser?._id });
  const UserContact = JSON.parse(Contacts);

  return (
    <div
      id="sidebar"
      className={
        ' md:h-screen h-screen relative flex flex-col  border-[1px]  border-[#b4b4b4]  w-full lg:w-[400px] bg-[#FAF9F6]'
      }
    >
      <SideBarClient GetCUser={GetCUser} Auser={Auser} Contacts={UserContact} />
    </div>
  );
};

export default SideBar;
