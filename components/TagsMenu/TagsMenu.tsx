"use client";

import Link from "next/link";
import { useState } from "react";
import css from "./TagsMenu.module.css";


const tags = ["All", "Work", "Personal", "Todo", "Meeting", "Shopping"];

export default function TagsMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <div className={css.menuContainer}>
      <button className={css.menuButton} onClick={toggleMenu}>
        Notes ▾
      </button>
      {isMenuOpen && (
        <ul className={css.menuList}>
          {tags.map((tag) => (
            <li key={tag} className={css.menuItem}>
              <Link
                href={
                  tag === "All" ? "/notes/filter/All" : `/notes/filter/${tag}`
                }
                className={css.menuLink}
                onClick={closeMenu} 
              >
                {tag}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
