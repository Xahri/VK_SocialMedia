'use client'
export const revalidate = 0
import Card from "./Card";
import { useState } from "react";
import { state } from "../state/State";

export default function FeedTabs() {
  const tabClasses = 'flex gap-1 px-6 py-1 items-center text-gray-500';
  const activeTabClasses = 'flex gap-1 px-6 py-1 items-center text-bloodRed font-bold';

  const [globalActive, setGlobalActive] = useState<boolean>(true);

  const activateGlobal = () => {
    setGlobalActive(true);
    state.globalActive = true;
  }

  const activateFollowing = () => {
    setGlobalActive(false);
    state.globalActive = false;
  }


  return (
    <Card>
      <div className="flex items-center justify-around">
        <button className={globalActive ? activeTabClasses : tabClasses} onClick={activateGlobal}>
          Global Feed
        </button>
        <button className={globalActive ? tabClasses : activeTabClasses} onClick={activateFollowing}>
          Followng Feed
        </button>
      </div>
    </Card>
  );
}