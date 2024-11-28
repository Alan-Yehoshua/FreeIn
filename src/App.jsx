import { useState } from "react";
import {Chat} from "./Chat";
import { useLocation } from "react-router-dom";

export function App () {
  const location = useLocation();
  const { SID, RID, name } = location.state || {};
  const [userId] = useState(SID); 
  const [receiverId] = useState(RID);

  return (
    <div>
      <Chat userId={userId} receiverId={receiverId} name={name} />
    </div>
  );
};