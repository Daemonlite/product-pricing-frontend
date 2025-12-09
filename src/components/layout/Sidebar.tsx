"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../../context/SidebarContext";
import { X, Grid3X3, Calendar, User, List, Table, FileText, PieChart, Box, Zap, MoreHorizontal, ChevronDown, DollarSign, Home, BarChart, Bed, Users, PanelLeftOpen, PanelLeftClose, Ship, Settings, MessageCircle, MessageCircleCode } from "lucide-react";

import SupportBanner from '../SupportBanner';

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItemsMenu: NavItem[] = [
  {
    icon: <Grid3X3 />,
    name: "Dashboard",
    path: "/",
  },
  {
    icon: <Box />,
    name: "Operations",
    subItems: [
      { name: "Categories", path: "/categories" },
      { name: "Products", path: "/products" },
      { name: "Shipping", path: "/shipping-details" },
      { name: "Users", path: "/users" },
    ],
  },
  {
    icon: <DollarSign />,
    name: "Pricing",
    subItems: [
      { name: "Pricing Calculator", path: "/pricing-calculator" },
      { name: "All Calculations", path: "/all-calculations" },
    ],
  },
  // {
  //   icon: <BarChart />,
  //   name: "Competitor Insights",
  //   subItems: [
  //     { name: "Competitor Analysis", path: "/competitor-analysis" },
  //     { name: "Competitor Sources", path: "/competitor-sources" },
  //   ],
  // },
  {
    icon: <FileText />,
    // name: "Reports &Monitoring",
    name: "Monitoring",
    subItems: [
      // { name: "Reports", path: "/reports" },
      { name: "Logs", path: "/logs" },
    ],
  },
];

const navItemsNotifications: NavItem[] = [
  {
    icon: <MessageCircleCode />,
    name: "Notifications",
    path: "/notifications",
  },
];

// const navItemsSettings: NavItem[] = [
//   {
//     icon: <Settings />,
//     name: "Settings",
//     path: "/settings",
//   },
// ];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered, setIsMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();
  const pathname = usePathname();

  const renderMenuItems = (
    navItems: NavItem[],
    menuType: string
  ) => (
    <ul className="space-y-2">
      {navItems.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-white/40 backdrop-blur-lg  hover:text-white group ${
                openSubmenu?.type === menuType && openSubmenu?.index === index
                  ? "bg-white/40 text-white hover:bg-white/40 backdrop-blur-lg hover:text-white border-white border-l-4"
                  : "text-white border-transparent"
              } ${
                !isExpanded && !isHovered
                  ? "lg:justify-center lg:px-2"
                  : "justify-start"
              }`}
            >
              <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <>
                  <span className="flex-grow text-left truncate">{nav.name}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 text-white cursor-pointer ${
                      openSubmenu?.type === menuType &&
                      openSubmenu?.index === index
                        ? "rotate-180"
                        : ""
                    }`}
                  />
                </>
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:bg-white/40 backdrop-blur-lg  hover:text-white group ${
                  isActive(nav.path) 
                    ? "bg-white/40 text-white hover:bg-white/40 backdrop-blur-lg hover:text-white border-white border-l-4" 
                    : "text-white border-transparent"
                } ${
                  !isExpanded && !isHovered
                    ? "lg:justify-center lg:px-2"
                    : "justify-start"
                }`}
              >
                <span className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="truncate">{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`${menuType}-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300 ease-out"
              style={{
                height:
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? `${subMenuHeight[`${menuType}-${index}`]}px`
                    : "0px",
              }}
            >
              <div className="pt-1 pb-2">
                <ul className="space-y-0.5 ml-8 border-l-2 border-white pl-4">
                  {nav.subItems.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        href={subItem.path}
                        className={`flex items-center justify-between py-2 px-3 text-sm transition-all duration-200 group ${
                          isActive(subItem.path)
                            ? "bg-white text-black"
                            : "text-white hover:bg-white/40 backdrop-blur-lg hover:text-white"
                        }`}
                      >
                        <span className="truncate">{subItem.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: string;
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>(
    {}
  );
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  useEffect(() => {
    // Check if the current path matches any submenu item
    let submenuMatched = false;
    const navItemsArrays = [navItemsMenu, navItemsNotifications];
    const types = ["menu", "notifications"];
    navItemsArrays.forEach((navItemsArray, arrayIndex) => {
      navItemsArray.forEach((nav, index) => {
        if (nav.subItems) {
          nav.subItems.forEach((subItem) => {
            if (isActive(subItem.path)) {
              setOpenSubmenu({
                type: types[arrayIndex],
                index,
              });
              submenuMatched = true;
            }
          });
        }
      });
    });

    // If no submenu item matches, close the open submenu
    if (!submenuMatched) {
      setOpenSubmenu(null);
    }
  }, [pathname, isActive]);

  useEffect(() => {
    // Set the height of the submenu items when the submenu is opened
    if (openSubmenu !== null) {
      const key = `${openSubmenu.type}-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const handleSubmenuToggle = (index: number, menuType: string) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (
        prevOpenSubmenu &&
        prevOpenSubmenu.type === menuType &&
        prevOpenSubmenu.index === index
      ) {
        return null;
      }
      return { type: menuType, index };
    });
  };

  return (
    <aside
      className={`fixed top-0 left-0 h-screen border-r transition-all duration-300 ease-in-out z-50 bg-primary ${
        isExpanded || isMobileOpen
          ? "xl:w-[290px] lg:w-[250px] md:w-[220px] w-[290px]"
          : isHovered
          ? "xl:w-[290px] lg:w-[250px] md:w-[220px] w-[200px]"
          : "xl:w-[90px] lg:w-[80px] md:w-[70px] w-[90px]"
      }
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      lg:translate-x-0 backdrop-blur-xl`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div
          className={`flex items-center px-6 py-4 ${
            !isExpanded && !isHovered ? "lg:justify-center lg:px-4" : "justify-start"
          }`}
        >
          <Link
            href="/"
            className="items-center gap-3 text-xl font-bold transition-colors flex"
          >
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <img src="/images/Eco.jpg" alt="Logo" />
            </div>
            {(isExpanded || isHovered || isMobileOpen) && (
              <span>ECOBOT Tech</span>
            )}
          </Link>
          <div className="absolute top-4 right-4 lg:hidden z-50">
            <button
              onClick={() => setIsMobileOpen(false)}
              className="p-2 bg-white rounded-full shadow-lg hover:bg-white/90 transition-colors cursor-pointer"
            >
              <PanelLeftOpen className="w-3 h-3 text-primary" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8" style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none; /* Safari and Chrome */
            }
          `}</style>
          <div>

            <div className="absolute top-16 -right-4 hidden lg:block">
              {/* Toggle button */  }
              <button
                onClick={toggleSidebar}
                className="p-2 bg-white rounded-full shadow-lg z-50 hover:bg-white/90 transition-colors cursor-pointer"
              >
                {isExpanded ? <PanelLeftClose className="w-3 h-3 text-primary" /> : <PanelLeftOpen className="w-3 h-3 text-primary" />}
              </button>
            </div>
            <div
              className={`mb-4 px-3 ${
                !isExpanded && !isHovered
                  ? "lg:flex lg:justify-center"
                  : "flex justify-start"
              }`}
            >
              {isExpanded || isHovered || isMobileOpen ? (
                <h2 className="text-xs font-semibold uppercase tracking-wider text-white">
                  Menu
                </h2>
              ) : (
                <div className="w-6 h-px bg-white"></div>
              )}
            </div>
            {renderMenuItems(navItemsMenu, "menu")}
          </div>
          <div>
            <div
              className={`mb-4 px-3 ${
                !isExpanded && !isHovered
                  ? "lg:flex lg:justify-center"
                  : "flex justify-start"
              }`}
            >
              {isExpanded || isHovered || isMobileOpen ? (
                <h2 className="text-xs font-semibold uppercase tracking-wider text-white">
                  Notifications
                </h2>
              ) : (
                <div className="w-6 h-px bg-white"></div>
              )}
            </div>
            {renderMenuItems(navItemsNotifications, "notifications")}
          </div>
          {/* <div>
            <div
              className={`mb-4 px-3 ${
                !isExpanded && !isHovered
                  ? "lg:flex lg:justify-center"
                  : "flex justify-start"
              }`}
            >
              {isExpanded || isHovered || isMobileOpen ? (
                <h2 className="text-xs font-semibold uppercase tracking-wider text-white">
                  Settings
                </h2>
              ) : (
                <div className="w-6 h-px bg-white"></div>
              )}
            </div>
            {renderMenuItems(navItemsSettings, "settings")}
          </div> */}
        </div>

        {/* Support Banner at bottom */}
        <SupportBanner isExpanded={isExpanded} isHovered={isHovered} isMobileOpen={isMobileOpen} />
      </div>
    </aside>
  );
};

export { AppSidebar as Sidebar };