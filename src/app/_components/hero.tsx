import Link from "next/link";
import hero from "../../../public/hero.jpeg";

export function Hero() {
  return (
    <div
      className="hero min-h-[calc(100vh-68px)]"
      style={{
        backgroundImage: `url(${hero.src})`,
      }}
    >
      <div className="hero-overlay bg-opacity-60"></div>
      <div className="hero-content text-center text-neutral-content">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">Mecial</h1>
          <p className="mb-5">Mecial（ミーシャル）はメタSNSです。</p>
          <Link href="api/auth/signin" className="btn btn-primary">
            ログイン
          </Link>
        </div>
      </div>
    </div>
  );
}
