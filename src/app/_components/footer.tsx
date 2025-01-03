import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer footer-center rounded bg-base-200 p-10 text-base-content">
      <nav className="grid grid-flow-col gap-4">
        <Link href="/terms-of-service" className="link-hover link">
          利用規約
        </Link>
        <Link href="/privacy-policy" className="link-hover link">
          プライバシーポリシー
        </Link>
        <Link href="/contact" className="link-hover link">
          お問い合わせ
        </Link>
      </nav>
      <nav>
        <div className="grid grid-flow-col gap-4">
          <Link
            href="https://github.com/haru52/mecial"
            target="_blank"
            rel="noreferrer"
            title="GitHubでソースコードを見る"
            aria-label="GitHubでソースコードを見る"
          >
            <FontAwesomeIcon icon={faGithub} className="h-6 w-6 fill-current" />
          </Link>
        </div>
      </nav>
      <aside>
        <p>
          Copyright © 2024-2025 - All right reserved by{" "}
          <Link
            href="https://haru52.com/"
            target="_blank"
            rel="noreferrer"
            className="link-hover link"
          >
            haru
          </Link>
        </p>
      </aside>
    </footer>
  );
}
