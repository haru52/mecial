import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";

export async function Header() {
  const session = await getServerAuthSession();
  const user = session == null ? null : await api.user.getById(session.user.id);

  return (
    <div className="navbar bg-base-100">
      <div className="container mx-auto px-4">
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
              <li>
                <Link href="/users">ユーザー</Link>
              </li>
              <li>
                <a>ソーシャル</a>
              </li>
            </ul>
          </div>
          <Link href="/" className="btn btn-ghost text-xl">
            Mecial
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link href="/users">ユーザー</Link>
            </li>
            <li>
              <a>ソーシャル</a>
            </li>
          </ul>
        </div>
        {session ? (
          <div className="flex-none gap-2">
            <div className="form-control">
              <input
                type="text"
                placeholder="Search"
                className="input input-bordered w-24 md:w-auto"
              />
            </div>
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="avatar btn btn-circle btn-ghost"
              >
                <div className="w-10 rounded-full">
                  <img alt="Tailwind CSS Navbar component" src={user.image} />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu dropdown-content menu-sm z-[1] mt-3 w-52 rounded-box bg-base-100 p-2 shadow"
              >
                <li>
                  <Link href={`/${user?.screenName}`}>プロフィール</Link>
                </li>
                <li>
                  <Link href={`/${user?.screenName}/edit`}>設定</Link>
                </li>
                <li>
                  <Link href="/api/auth/signout">ログアウト</Link>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="navbar-end">
            <Link href="/api/auth/signin" className="btn">
              ログイン
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
