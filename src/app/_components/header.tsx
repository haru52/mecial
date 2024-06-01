"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { defaultUserIconPath, loginPath, logoutPath } from "~/consts";
import type { Social } from "~/entities/social";
import type { User } from "~/entities/user";
import { closeDaisyUiDropdown } from "~/util";
import { ThemeController } from "./theme-controller";

export function Header({
  user,
  currentSocial,
}: {
  user: User | null;
  currentSocial: Social | null;
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="navbar bg-base-100">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
          >
            <li onClick={closeDaisyUiDropdown}>
              <Link href="/">ホーム</Link>
            </li>
            {currentSocial !== null && (
              <li>
                <Link href={`/socials/${currentSocial.screenName}`}>
                  {currentSocial.name}
                </Link>
              </li>
            )}
            <li onClick={closeDaisyUiDropdown}>
              <Link href="/socials">ソーシャル</Link>
            </li>
            <li onClick={closeDaisyUiDropdown}>
              <Link href="/users">ユーザー</Link>
            </li>
            <li>
              <ThemeController placeContentStart={true} />
            </li>
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost text-xl">
          Mecial
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li onClick={closeDaisyUiDropdown}>
            <Link href="/">ホーム</Link>
          </li>
          {currentSocial !== null && (
            <li>
              <Link href={`/socials/${currentSocial.screenName}`}>
                {currentSocial.name}
              </Link>
            </li>
          )}
          <li>
            <Link href="/socials">ソーシャル</Link>
          </li>
          <li>
            <Link href="/users">ユーザー</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end gap-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            router.push(`/search?q=${searchQuery}`);
          }}
        >
          <div className="form-control">
            <label className="input input-bordered flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 16 16"
                fill="currentColor"
                className="h-4 w-4 opacity-70"
              >
                <path
                  fillRule="evenodd"
                  d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                  clipRule="evenodd"
                />
              </svg>
              <input
                type="search"
                name="search"
                className="w-16 grow md:w-auto"
                placeholder="検索"
                value={searchQuery}
                required
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </label>
          </div>
        </form>
        <div className="hidden lg:block">
          <ThemeController />
        </div>
        {user === null ? (
          <Link href={loginPath} className="btn">
            ログイン
          </Link>
        ) : (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="avatar btn btn-circle btn-ghost"
            >
              <div className="w-10 rounded-full">
                <Image
                  src={user?.image ?? defaultUserIconPath}
                  width={500}
                  height={500}
                  alt={user.name ?? "あなたのアイコン画像"}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
            >
              <li onClick={closeDaisyUiDropdown}>
                <Link href={`/${user.screenName}`}>プロフィール</Link>
              </li>
              <li onClick={closeDaisyUiDropdown}>
                <Link href={`/${user.screenName}/edit`}>設定</Link>
              </li>
              <li onClick={closeDaisyUiDropdown}>
                <Link href={logoutPath}>ログアウト</Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
