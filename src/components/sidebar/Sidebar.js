"use client";

import { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaHome, FaChartPie, FaChartBar, FaLayerGroup } from "react-icons/fa";
import "./Sidebar.css";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { label: "Dashboard", icon: <FaHome />, href: "/dashboard" },
    { label: "Stocks", icon: <FaChartPie />, href: "/investments" },
    { label: "Bonds", icon: <FaChartBar />, href: "/bonds" },
    { label: "Precious Metals", icon: <FaLayerGroup />, href: "/metals" },
  ];

  return (
    <div className="layout">
      <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-header">
          {isOpen && <h1 className="logo">My App</h1>}
          <button className="toggle-btn" onClick={toggleSidebar}>
            {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
          </button>
        </div>

        <nav className="menu">
          {menuItems.map((item, index) => (
            <a key={index} href={item.href} className="menu-item">
              <span className="icon">{item.icon}</span>
              {isOpen && <span className="text">{item.label}</span>}
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">{isOpen ? "© 2025 My App" : "©"}</div>
      </div>

    </div>
  );
}
