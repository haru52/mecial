import { defaultUserIconPath } from "~/consts";
import Image from "next/image";
import Link from "next/link";
import type { User as UserEntity } from "~/entities/user";

export async function User({ user }: { user: UserEntity }) {
  return (
    <Link href={`${user.screenName}`} className="inline-block no-underline">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="card-title">
            <div className="not-prose avatar">
              <div className="w-11 rounded-full">
                <Image
                  src={user.image ?? defaultUserIconPath}
                  width={500}
                  height={500}
                  alt=""
                />
              </div>
            </div>
            <div>
              <h2 className="my-0 inline text-sm">{user.name}</h2>
              <span> </span>
              <span className="text-sm">@{user.screenName}</span>
            </div>
          </div>
          <p>{user.introduction ?? ""}</p>
        </div>
      </div>
    </Link>
  );
}
