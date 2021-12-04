import React from "react";
import "../styles.css";
import {API} from '../backend';
import Base from "./Base";

export default function Home() {
  console.log('API Is:', API);
  return (
    <Base title="Home Page" description="Welcome to Tshirt shorooms">
        <div className="row">
          <div className="col-4">
            <button className="btn btn-success">TESt</button>
          </div>
          <div className="col-4">
            <button className="btn btn-success">TESt</button>
          </div>
          <div className="col-4">
            <button className="btn btn-success">TESt</button>
          </div>
        </div>
    </Base>
  );
}
