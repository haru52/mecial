"use client";

import { useRouter } from "next/navigation";
import type { User } from "~/entities/user";
import { api } from "~/trpc/react";
import { useState } from "react";
import { InputErrorMessages } from "~/app/_components/input-error-messages";
import clsx from "clsx";

export function EditForm({ user }: { user: User }) {
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [screenName, setScreenName] = useState(user.screenName);
  const [email, setEmail] = useState(user.email);
  const [introduction, setIntroduction] = useState(user.introduction);
  const [url, setUrl] = useState(user.url);
  const [image, setImage] = useState(user.image);
  const { mutate, error, isPending } = api.user.update.useMutation({
    onSuccess: () => {
      router.push(`/${screenName}`);
      router.refresh();
    },
  });
  const nameErrors = error?.data?.zodError?.fieldErrors.name;
  const screenNameErrors = error?.data?.zodError?.fieldErrors.screenName;
  const emailErrors = error?.data?.zodError?.fieldErrors.email;
  const urlErrors = error?.data?.zodError?.fieldErrors.url;
  const introductionErrors = error?.data?.zodError?.fieldErrors.introduction;
  const imageErrors = error?.data?.zodError?.fieldErrors.image;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutate({
          name,
          screenName,
          email,
          image,
          introduction,
          url,
        });
      }}
    >
      <label className="form-control mx-auto w-full max-w-xs">
        <span className="label">名前</span>
        <input
          type="text"
          placeholder="山田 太郎"
          className={`input input-bordered w-full max-w-xs ${clsx({ "input-error": nameErrors !== undefined })}`}
          value={name ?? ""}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <InputErrorMessages errMsgs={nameErrors} />
      </label>
      <label className="form-control mx-auto w-full max-w-xs">
        <span className="label">ID</span>
        <input
          type="text"
          placeholder="taroyamada"
          className={`input input-bordered w-full max-w-xs ${clsx({ "input-error": screenNameErrors !== undefined })}`}
          value={screenName ?? ""}
          onChange={(e) => setScreenName(e.target.value)}
          required
        />
        <InputErrorMessages errMsgs={screenNameErrors} />
      </label>
      <label className="form-control mx-auto w-full max-w-xs">
        <span className="label">メールアドレス</span>
        <input
          type="email"
          placeholder="taroyamada@example.com"
          className={`input input-bordered w-full max-w-xs ${clsx({ "input-error": emailErrors !== undefined })}`}
          value={email ?? ""}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <InputErrorMessages errMsgs={emailErrors} />
      </label>
      <label className="form-control mx-auto w-full max-w-xs">
        <span className="label">自己紹介</span>
        <textarea
          placeholder="自己紹介文。"
          className={clsx("textarea textarea-bordered w-full max-w-xs", {
            "input-error": introductionErrors !== undefined,
          })}
          value={introduction ?? ""}
          onChange={(e) => setIntroduction(e.target.value)}
        />
        <InputErrorMessages errMsgs={emailErrors} />
      </label>
      <label className="form-control mx-auto w-full max-w-xs">
        <span className="label">ウェブサイト</span>
        <input
          type="text"
          placeholder="https://taroyamada.com"
          className={clsx("input input-bordered w-full max-w-xs", {
            "input-error": urlErrors !== undefined,
          })}
          value={url ?? ""}
          onChange={(e) => setUrl(e.target.value)}
        />
        <InputErrorMessages errMsgs={urlErrors} />
      </label>
      <label className="form-control mx-auto w-full max-w-xs">
        <span className="label">アイコン画像URL</span>
        <input
          type="text"
          placeholder="https://example.com/taroyamada.jpg"
          className={`input input-bordered w-full max-w-xs ${clsx({ "input-error": emailErrors !== undefined })}`}
          value={image ?? ""}
          onChange={(e) => setImage(e.target.value)}
          required
        />
        <InputErrorMessages errMsgs={imageErrors} />
      </label>
      <div className="form-control mx-auto mt-7 w-full max-w-xs">
        <input
          type="submit"
          value={isPending ? "保存中…" : "保存"}
          className="btn btn-primary btn-block"
          disabled={isPending}
        />
      </div>
    </form>
  );
}
