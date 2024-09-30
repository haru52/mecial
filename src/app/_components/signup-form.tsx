"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { InputErrorMessages } from "~/app/_components/input-error-messages";
import { api } from "~/trpc/react";
import { imageUrlRuleMessage, screenNameRule } from "~/consts";
import type { User } from "~/entities/user";

function validate(screenName: string, name: string | null) {
  return (
    screenName.trim().length > 0 && name !== null && name.trim().length > 0
  );
}

export function SignupForm({ user }: { user: User }) {
  const router = useRouter();
  const [screenName, setScreenName] = useState("");
  const [name, setName] = useState(user.name);
  const [image, setImage] = useState(user.image);
  const [isDisabled, setIsDisabled] = useState(false);
  const { mutate, error } = api.user.update.useMutation({
    onSuccess: () => {
      router.push(`/`);
      router.refresh();
    },
    onError: () => {
      setIsDisabled(false);
    },
  });
  const screenNameErrors: string[] = [];
  if (error?.data?.zodError?.fieldErrors.screenName !== undefined) {
    screenNameErrors.push(...error.data.zodError.fieldErrors.screenName);
  }
  if (error !== null && error?.data?.zodError == null)
    screenNameErrors.push(error.message);

  const nameErrors: string[] = [];
  if (error?.data?.zodError?.fieldErrors.name !== undefined) {
    nameErrors.push(...error.data.zodError.fieldErrors.name);
  }
  const imageErrors: string[] = [];
  if (error?.data?.zodError?.fieldErrors.image !== undefined) {
    imageErrors.push(...error.data.zodError.fieldErrors.image);
  }

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setIsDisabled(true);
        mutate({
          screenName,
          name,
          image:
            image === null ? null : image.trim().length === 0 ? null : image,
        });
      }}
    >
      <label className="form-control mx-auto w-full max-w-xs">
        <span className="label label-text">ID</span>
        <input
          type="text"
          className={`input input-bordered w-full max-w-xs ${clsx({ "input-error": screenNameErrors !== undefined && screenNameErrors.length > 0 })}`}
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
          className={`input input-bordered w-full max-w-xs ${clsx({ "input-error": nameErrors !== undefined && nameErrors.length > 0 })}`}
          value={name ?? ""}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <InputErrorMessages errMsgs={nameErrors} />
      </label>
      <label className="form-control mx-auto w-full max-w-xs">
        <span className="label label-text">アイコン画像URL</span>
        <input
          type="text"
          className={`input input-bordered w-full max-w-xs ${clsx({ "input-error": imageErrors !== undefined && imageErrors.length > 0 })}`}
          value={image ?? ""}
          onChange={(e) => setImage(e.target.value)}
        />
        <span className="label label-text-alt">{imageUrlRuleMessage}</span>
        <InputErrorMessages errMsgs={imageErrors} />
      </label>
      <div className="form-control mx-auto mt-7 w-full max-w-xs">
        <input
          type="submit"
          value={isDisabled ? "サインアップ中…" : "サインアップ"}
          className="btn btn-primary btn-block rounded-full"
          disabled={isDisabled || !validate(screenName, name)}
        />
      </div>
    </form>
  );
}
