import List from "./list";
import Newbutton from "./new-button";

const Sidebar = () => {
  return (
    <aside className="fixed z-[1] left-0 bg-black h-full w-[60px] flex p-3 flex-col gap-y-4 text-white ">
        <List />
      <Newbutton />
    </aside>
  );
};

export default Sidebar;
