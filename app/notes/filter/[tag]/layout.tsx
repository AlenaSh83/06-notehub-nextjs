
import Link from "next/link";
import styles from "./layout.module.css";

export default function FilterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tags = ["All", "Todo", "Work", "Personal", "Meeting", "Shopping"];

  return (
    <div className={styles.wrapper}>
      <aside className={styles.sidebar}>
        <h3>Filter by tag</h3>
        <ul>
          {tags.map((tag) => (
            <li key={tag}>
              <Link href={`/notes/filter/${tag}`}>{tag}</Link>
            </li>
          ))}
        </ul>
      </aside>

      <main className={styles.content}>{children}</main>
    </div>
  );
}
