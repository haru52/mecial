import type { AvatarWithUser } from "~/entities/avatar";
import { DEFAULT_ICON_PATH } from "~/consts";
import Image from "next/image";
import Link from "next/link";

export function Avatar({ avatar }: { avatar: AvatarWithUser }) {
  return (
    <Link href={`/socials/main/${avatar.user.screenName}`} className="no-underline">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="card-title">
            <div className="not-prose avatar">
              <div className="w-11 rounded-full">
                <Image
                  src={avatar.user.image ?? DEFAULT_ICON_PATH}
                  width={500}
                  height={500}
                  alt=""
                />
              </div>
            </div>
            <div>
              <h2 className="my-0">{`${avatar.user.name}`}</h2>
              <span>@{avatar.user.screenName}</span>
            </div>
          </div>
          <p>アバターの自己紹介文。</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary">フォロー</button>
          </div>
        </div>
      </div>
    </Link>
  );
}
