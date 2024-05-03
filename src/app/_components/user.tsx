import type { User as UserEntity } from "~/entities/user";
import Link from "next/link";
import Image from "next/image";

export function User({ user }: { user: UserEntity }) {
  return (
    <Link href={`/${user.screenName}`} className="block">
      <h1>{user.name}</h1>
      <Image src={user.image} width={100} height={100} alt="" />
      <p>{user.screenName}</p>
    </Link>
  );
}
