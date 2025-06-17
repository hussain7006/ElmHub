"use client";
import * as React from "react";
import { Sidebar } from "./Sidebar";
import { MainContent } from "./MainContent";

function Homepage() {
  return (
    <div className="flex overflow-hidden gap-3.5 bg-slate-100">
      <Sidebar />
      <MainContent />
    </div>
  );
}

export default Homepage;