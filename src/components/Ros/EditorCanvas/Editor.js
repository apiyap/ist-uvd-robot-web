import React, {
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
  useCallback,
} from "react";

import { useSelector, useDispatch } from "react-redux";
import {
  getIsConnected,
  updateConnected,
  rosConnect,
  Ros,
} from "../../../features/Ros/rosSlice";
import { getAuthUser } from "../../../features/Auth/AuthSlice";

import { EditorCanvas } from "./index";
import {
  Button,
  Modal,
  Form,
  InputGroup,
  Row,
  Col,
  DropdownButton,
  Dropdown,
  ToggleButton,
} from "react-bootstrap";
import { useTranslation, Trans } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// import { ImageMapClient } from "./Objects/ImageMapClient";

export const Editor = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  //const rosConnected = useSelector((state) => getIsConnected(state));
  const user = useSelector((state) => getAuthUser(state));

  const [viewHeight, setViewHeight] = useState(400);
  const [viewWidth, setViewWidth] = useState(400);
  const [showToolbar, setShowToolbar] = useState(true);
  const [activeTool, setActiveTool] = useState("NONE");

  const [saveModelShow, setSaveModelShow] = useState(false);
  const [saveValidated, setSaveValidated] = useState(false);
  const textInput = useRef(null);
  const [openModelShow, setOpenModelShow] = useState(false);

  const [zoomShow, setZoomShow] = useState(false);
  const [drawShow, setDrawShow] = useState(false);

  const [zoomActive, setZoomActive] = useState('');
  const [drawActive, setDrawActive] = useState('');


  const { t } = useTranslation();

  const viewRef = useRef(null);
  const editorRef = useRef(null);
  const canvasRef = useRef(null);

  const getWidth = () => {
    return viewRef.current.offsetWidth - 30;
  };
  const getHeight = () => {
    return viewRef.current.offsetHeight - 30 - (showToolbar ? 38 : 0);
  };

  const WindowSize = useCallback(() => {
    if (viewRef.current !== null) {
      setViewHeight(getHeight());
      setViewWidth(getWidth());
    }
  }, [viewRef, getWidth, getHeight, showToolbar]);

  useEffect(() => {
    if (!Ros.isConnected) dispatch(rosConnect(user));

    if (canvasRef.current !== null) {
      if (canvasRef.current.getContext) {
        if (editorRef.current === null) {
          editorRef.current = new EditorCanvas("canvas", { ros: Ros });
          editorRef.current.init();
        }
      } else {
        console.error("Cant draw canvas");
      }
    }

    window.addEventListener("resize", WindowSize);
    WindowSize();

    return () => {
      window.removeEventListener("resize", WindowSize);
      if (editorRef.current != null) editorRef.current.exit();
    };
  }, [editorRef, WindowSize, viewRef, Ros, dispatch, rosConnect, user]);

  useImperativeHandle(ref, () => ({
    getAlert() {
      alert("getAlert from Viewer");
    },
    setToolbar(e) {
      setShowToolbar(e);
      WindowSize();
    },
  }));

  function rotateLeft() {
    if (editorRef.current !== null) {
      editorRef.current.rotateViewLeft();
    }
  }

  function rotateRight() {
    if (editorRef.current !== null) {
      editorRef.current.rotateViewRight();
    }
  }

  function serachLocationt() {
    if (editorRef.current !== null) {
      // editorRef.current.viewToRobot();
    }
  }
  const handleSaveClose = () => {
    setSaveModelShow(false);
  };
  const handleSaveShow = () => {
    setSaveValidated(false);
    setSaveModelShow(true);
  };
  const handleSaveSubmit = (event) => {
    event.preventDefault();
    const form = event.target;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setSaveValidated(true);
      return;
    }
    console.log(textInput.current.value);
    setSaveModelShow(false);
    // gridClientRef.current.saveMap(textInput.current.value).then((result) => {
    //   console.log(result);
    // });
  };
  const handleOpenShow = () => {
    setOpenModelShow(true);
  };

  const handleOpenClose = () => {
    setOpenModelShow(false);
  };

  const setEditorActiveTool = (v) => {
    //console.log(v)
    if (editorRef.current !== null) {
      editorRef.current.setActiveTool(v);
      setActiveTool(editorRef.current.activeTool);
      setDrawShow(false);setZoomShow(false);setZoomActive('');setDrawActive('');
    }
  };

  const setEditorViewAll = ()=>{
    if (editorRef.current !== null) {
      editorRef.current.viewAll();
    }
  }

  const setEditorViewOrg = () => {
    if (editorRef.current !== null) {
      editorRef.current.viewToMap();
    }

  }

  return (
    <div ref={viewRef} className="container-fluid">
      <div className="col-12">
        <div className="editor">
          <div style={{ display: showToolbar ? "block" : "none" }}>
            <button
              type="button"
              className="btn btn-primary float-left mr-2"
              onClick={rotateLeft}
            >
              <FontAwesomeIcon
                icon={["fas", "level-down-alt"]}
                flip="horizontal"
              />
            </button>

            <div className="btn-group mr-2">
              <button
                type="button"
                className="btn btn-default btn-flat"
                onClick={handleOpenShow}
              >
                <FontAwesomeIcon icon={["fas", "folder-open"]} />
              </button>
              <button
                type="button"
                className="btn btn-default btn-flat"
                onClick={handleSaveShow}
              >
                <FontAwesomeIcon icon={["fas", "save"]} />
              </button>
              <button
                type="button"
                className="btn btn-default btn-flat"
                onClick={() => setEditorActiveTool("CUT")}
              >
                <FontAwesomeIcon icon={["fas", "cut"]} />
              </button>
              <button
                type="button"
                className="btn btn-default btn-flat"
                onClick={() => setEditorActiveTool("COPY")}
              >
                <FontAwesomeIcon icon={["fas", "copy"]} />
              </button>
              <button
                type="button"
                className="btn btn-default btn-flat"
                onClick={() => setEditorActiveTool("PASTE")}
              >
                <FontAwesomeIcon icon={["fas", "paste"]} />
              </button>
            </div>

            <div
              className="btn-group btn-group-toggle mr-2"
              data-toggle="buttons"
            >
              <label
                className={
                  "btn bg-olive" + (activeTool === "POINTER" ? " active" : "")
                }
                onClick={() => {setEditorActiveTool("POINTER");}}
              >
                <input
                  type="radio"
                  name="options"
                  id="option1"
                  autoComplete="off"
                  defaultChecked
                />{" "}
                <FontAwesomeIcon icon={["fas", "mouse-pointer"]} />
              </label>

              <div className={"btn-group"+ (zoomShow?" show":"" )  } onClick={()=>{setZoomShow(!zoomShow);setDrawShow(false);setActiveTool("TZOOM") }}>
                <button type="button" className={"btn bg-olive dropdown-toggle dropdown-icon" +  (activeTool === "TZOOM" ? " active" : "")} data-toggle="dropdown">
                <FontAwesomeIcon icon={["fas", "search-location"]} />
                </button>
                <div className={"dropdown-menu" + (zoomShow?" show":"" )}>
                  <a className={"dropdown-item" + (zoomActive==="ZOOMPAN"?" active":"")} href="#" onClick={() => {setEditorActiveTool("ZOOMPAN");setZoomActive("ZOOMPAN")}}><FontAwesomeIcon icon={["fas", "search-location"]} /> <span className="mr-2"/> Zoom & Pan</a>
                  <a className={"dropdown-item" + (zoomActive==="ZOOMALL"?" active":"")} href="#" onClick={()=>{ setZoomActive("ZOOMALL");setEditorViewAll()}}><FontAwesomeIcon icon={["fas", "expand"]} /> <span className="mr-2"/> View All</a>
                  <a className={"dropdown-item" + (zoomActive==="ZOOMORG"?" active":"")} href="#" onClick={()=>{ setZoomActive("ZOOMORG");setEditorViewOrg()}}><FontAwesomeIcon icon={["fas", "crosshairs"]} /> <span className="mr-2"/> View Map Origin</a>
                </div>
              </div>

              <div className={"btn-group" + (drawShow?" show":"")} onClick={()=>{setDrawShow(!drawShow);setZoomShow(false);setActiveTool("TDRAW")}}>
                <button type="button" className={"btn bg-olive dropdown-toggle dropdown-icon" +  (activeTool === "TDRAW" ? " active" : "")} data-toggle="dropdown">
                <FontAwesomeIcon icon={["fas", "shapes"]} />
                </button>
                <div className={"dropdown-menu" + (drawShow?" show":"")}>
                  <a className={"dropdown-item" + (drawActive==="LINE"?" active":"")} href="#" onClick={()=>{setEditorActiveTool("LINE");setDrawActive("LINE");}} ><FontAwesomeIcon icon={["fas", "pencil-alt"]} /> <span className="mr-2"/> Line </a>
                  <a className={"dropdown-item" + (drawActive==="POLYLINE"?" active":"")} href="#" onClick={()=>{setEditorActiveTool("POLYLINE");setDrawActive("POLYLINE");}}><FontAwesomeIcon icon={["fas", "bezier-curve"]} /> <span className="mr-2"/> Poly Line</a>
                  <a className={"dropdown-item" + (drawActive==="RECT"?" active":"")} href="#" onClick={()=>{setEditorActiveTool("RECT");setDrawActive("RECT");}}><FontAwesomeIcon icon={["fas", "vector-square"]} /> <span className="mr-2"/> Rectangle</a>
                  <a className={"dropdown-item" + (drawActive==="CIRCLE"?" active":"")} href="#" onClick={()=>{setEditorActiveTool("CIRCLE");setDrawActive("CIRCLE");}}><FontAwesomeIcon icon={["fas", "circle"]} /> <span className="mr-2"/> Elips</a>
                  <a className={"dropdown-item" + (drawActive==="TEXT"?" active":"")} href="#" onClick={()=>{setEditorActiveTool("TEXT");setDrawActive("TEXT");}}><FontAwesomeIcon icon={["fas", "text-height"]} /> <span className="mr-2"/> Text</a>
                  <a className={"dropdown-item" + (drawActive==="IMAGE"?" active":"")} href="#" onClick={()=>{setEditorActiveTool("IMAGE");setDrawActive("IMAGE");}}><FontAwesomeIcon icon={["fas", "image"]} /> <span className="mr-2"/> Image</a>
                
                </div>
              </div>



            </div>
            <div
              className="btn-group btn-group-toggle mr-2"
              data-toggle="buttons"
            >
              <label
                className={
                  "btn bg-olive" + (activeTool === "DOCKING" ? " active" : "")
                }
                onClick={() => setEditorActiveTool("DOCKING")}
              >
                <input
                  type="radio"
                  name="options5"
                  id="option5"
                  autoComplete="off"
                  defaultChecked
                />{" "}
                <FontAwesomeIcon icon={["fas", "charging-station"]} />
              </label>
              <label
                className={
                  "btn bg-olive" + (activeTool === "ROOM" ? " active" : "")
                }
                onClick={() => setEditorActiveTool("ROOM")}
              >
                <input
                  type="radio"
                  name="options5"
                  id="option5"
                  autoComplete="off"
                  defaultChecked
                />{" "}
                <FontAwesomeIcon icon={["fas", "border-style"]} />
              </label>
              <label
                className={
                  "btn bg-olive" + (activeTool === "ROUTE" ? " active" : "")
                }
                onClick={() => setEditorActiveTool("ROUTE")}
              >
                <input
                  type="radio"
                  name="options5"
                  id="option5"
                  autoComplete="off"
                  defaultChecked
                />{" "}
                <FontAwesomeIcon icon={["fas", "road"]} />
              </label>
              <label
                className={
                  "btn bg-olive" + (activeTool === "NOGO" ? " active" : "")
                }
                onClick={() => setEditorActiveTool("NOGO")}
              >
                <input
                  type="radio"
                  name="options5"
                  id="option5"
                  autoComplete="off"
                  defaultChecked
                />{" "}
                <FontAwesomeIcon icon={["fas", "store-alt-slash"]} />
              </label>
            </div>

            <button
              type="button"
              className="btn btn-primary float-right"
              onClick={rotateRight}
            >
              <FontAwesomeIcon icon={["fas", "level-down-alt"]} />
            </button>
          </div>

          <canvas
            ref={canvasRef}
            id="canvas"
            className="canvas"
            width={viewWidth}
            height={viewHeight}
          >
            ): Your browser does not support the HTML5 canvas tag.
          </canvas>

          <Modal
            show={saveModelShow}
            onHide={handleSaveClose}
            backdrop="static"
            keyboard={false}
          >
            <Form
              noValidate
              validated={saveValidated}
              onSubmit={handleSaveSubmit}
            >
              <Modal.Header closeButton>
                <Modal.Title>
                  {" "}
                  <FontAwesomeIcon icon={["fas", "map-marked-alt"]} />
                  <span className="mr-1"></span>
                  <Trans i18nKey="viewer2d.save_model.title">Save map </Trans>
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <InputGroup>
                  <Form.Control
                    required
                    name="mapname"
                    type="text"
                    placeholder={t("viewer2d.save_model.text")}
                    ref={textInput}
                  />
                  <Form.Control.Feedback type="invalid">
                    <Trans i18nKey="viewer2d.save_model.invalidname">
                      Please enter valid map name.
                    </Trans>
                  </Form.Control.Feedback>
                </InputGroup>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleSaveClose}>
                  <FontAwesomeIcon icon={["fas", "times"]} />{" "}
                  <span className="mr-1"></span>
                  <Trans i18nKey="viewer2d.save_model.buttons.cancel">
                    Cancel
                  </Trans>
                </Button>
                <Button type="submit" variant="primary">
                  {" "}
                  <FontAwesomeIcon icon={["fas", "save"]} />{" "}
                  <span className="mr-1"></span>
                  <Trans i18nKey="viewer2d.save_model.buttons.save">Save</Trans>
                </Button>
              </Modal.Footer>
            </Form>
          </Modal>

          <Modal
            show={openModelShow}
            backdrop="static"
            keyboard={false}
            onHide={handleOpenClose}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                {" "}
                <FontAwesomeIcon icon={["fas", "map-marked-alt"]} />
                <span className="mr-1"></span>
                <Trans i18nKey="viewer2d.open_model.title">Open map </Trans>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Col xs="auto">
                <InputGroup>
                  <Form.Group as={Row} controlId="exampleForm.ControlSelect1">
                    <Form.Label>
                      <Trans i18nKey="viewer2d.open_model.text">
                        {" "}
                        Maps select
                      </Trans>
                    </Form.Label>
                    <Form.Control as="select">
                      <option>Map1</option>
                      <option>Map2</option>
                      <option>Map3</option>
                      <option>Map4</option>
                      <option>Map5</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Control.Feedback type="invalid">
                    <Trans i18nKey="viewer2d.open_model.invalidmap">
                      Please select a map.
                    </Trans>
                  </Form.Control.Feedback>
                </InputGroup>
              </Col>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleOpenClose}>
                <FontAwesomeIcon icon={["fas", "times"]} />{" "}
                <span className="mr-1"></span>
                <Trans i18nKey="viewer2d.open_model.buttons.cancel">
                  Cancel
                </Trans>
              </Button>
              <Button type="submit" variant="primary">
                {" "}
                <FontAwesomeIcon icon={["fas", "folder-open"]} />{" "}
                <span className="mr-1"></span>
                <Trans i18nKey="viewer2d.open_model.buttons.open">Open</Trans>
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
});
