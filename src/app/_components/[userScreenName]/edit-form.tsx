"use client";

import { useRouter } from "next/navigation";
import type { User } from "~/entities/user";
import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import { InputErrorMessages } from "~/app/_components/input-error-messages";
import clsx from "clsx";
import { screenNameRule } from "~/consts";

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

  const [requiredAreFilled, setRequiredAreFilled] = useState(true);

  useEffect(() => {
    setRequiredAreFilled(
      !!screenName?.trim() && !!name?.trim() && !!email?.trim(),
    );
  }, [screenName, name, email]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutate({
          name,
          screenName,
          email,
          image: image === "" ? null : image,
          introduction: introduction === "" ? null : introduction,
          url: url === "" ? null : url,
        });
      }}
    >
      <label className="form-control mx-auto w-full max-w-xs">
        <span className="label label-text">ID</span>
        <input
          type="text"
          className={`input input-bordered w-full max-w-xs ${clsx({ "input-error": screenNameErrors !== undefined })}`}
          value={screenName ?? ""}
          onChange={(e) => setScreenName(e.target.value)}
          required
        />
        <span className="label label-text-alt">{screenNameRule}</span>
        <InputErrorMessages errMsgs={screenNameErrors} />
      </label>
      <label className="form-control mx-auto w-full max-w-xs">
        <span className="label label-text">名前</span>
        <input
          type="text"
          className={`input input-bordered w-full max-w-xs ${clsx({ "input-error": nameErrors !== undefined })}`}
          value={name ?? ""}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <InputErrorMessages errMsgs={nameErrors} />
      </label>
      <label className="form-control mx-auto w-full max-w-xs">
        <span className="label label-text">メールアドレス</span>
        <input
          type="email"
          className={`input input-bordered w-full max-w-xs ${clsx({ "input-error": emailErrors !== undefined })}`}
          value={email ?? ""}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <InputErrorMessages errMsgs={emailErrors} />
      </label>
      <label className="form-control mx-auto w-full max-w-xs">
        <span className="label label-text">自己紹介</span>
        <textarea
          className={clsx("textarea textarea-bordered w-full max-w-xs", {
            "input-error": introductionErrors !== undefined,
          })}
          value={introduction ?? ""}
          onChange={(e) => setIntroduction(e.target.value)}
        />
        <InputErrorMessages errMsgs={emailErrors} />
      </label>
      <label className="form-control mx-auto w-full max-w-xs">
        <span className="label label-text">ウェブサイト</span>
        <input
          type="text"
          className={clsx("input input-bordered w-full max-w-xs", {
            "input-error": urlErrors !== undefined,
          })}
          value={url ?? ""}
          onChange={(e) => setUrl(e.target.value)}
        />
        <InputErrorMessages errMsgs={urlErrors} />
      </label>
      <label className="form-control mx-auto w-full max-w-xs">
        <span className="label label-text">アイコン画像URL</span>
        <input
          type="text"
          className={`input input-bordered w-full max-w-xs ${clsx({ "input-error": emailErrors !== undefined })}`}
          value={image ?? ""}
          onChange={(e) => setImage(e.target.value)}
        />
        <InputErrorMessages errMsgs={imageErrors} />
      </label>
      <div className="form-control mx-auto mt-7 w-full max-w-xs">
        <input
          type="submit"
          value={isPending ? "保存中…" : "保存"}
          className="btn btn-primary btn-block rounded-full"
          disabled={!requiredAreFilled || isPending}
        />
      </div>
    </form>
  );
}
