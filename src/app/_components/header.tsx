"use client";

import Image from "next/image";
import Link from "next/link";
import { defaultUserIconPath, loginPath, logoutPath } from "~/consts";
import type { Social } from "~/entities/social";
import type { User } from "~/entities/user";
import { closeDaisyUiDropdown } from "~/util";
import { useState } from "react";
import { useRouter } from "next/navigation";

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
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost text-xl">
          Mecial
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
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
            <input
              type="search"
              name="search"
              placeholder="検索"
              className="input input-bordered w-24 md:w-auto"
              defaultValue={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </form>
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
