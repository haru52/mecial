import { defaultUserAndAvatarIconPath } from "~/consts";
import Image from "next/image";
import Link from "next/link";
import type { User as UserEntity } from "~/entities/user";

export async function User({ user }: { user: UserEntity }) {
  return (
    <Link
      href={`${user.screenName}`}
      className="mx-auto block w-full no-underline"
    >
      <div className="card w-full bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="card-title">
            <div className="not-prose avatar">
              <div className="w-11 rounded-full">
                <Image
                  src={user.image ?? defaultUserAndAvatarIconPath}
                  width={500}
                  height={500}
                  alt=""
                />
              </div>
            </div>
            <div>
              <h2 className="card-title my-0">{user.name}</h2>
              <p className="my-0 text-sm">@{user.screenName}</p>
            </div>
          </div>
          <p>{user.introduction ?? ""}</p>
        </div>
      </div>
    </Link>
  );
}
