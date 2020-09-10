import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Frame from "../../Frame";
import ControlSidebar from "./ControlSidebar";
import { Editor } from '../../../Ros/EditorCanvas/Editor';

export default function EditMap() {

  return (
    <>
      <Frame>
      <Editor
          showToolbar = {true}
        />
      </Frame>
      <ControlSidebar />
    </>
  );
}
