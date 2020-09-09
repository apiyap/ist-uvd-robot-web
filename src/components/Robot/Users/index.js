import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Frame from "../Frame";
import ControlSidebar from "./ControlSidebar";

export default function Users() {
  return (
    <>
      <Frame>
        <div className="container-fluid">
          <h1>Robot users</h1>
        </div>
      </Frame>
      <ControlSidebar />
    </>
  );
}
