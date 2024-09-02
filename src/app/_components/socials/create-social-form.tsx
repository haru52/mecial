"use client";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import { InputErrorMessages } from "~/app/_components/input-error-messages";

export function CreateSocialForm() {
  const router = useRouter();
  const [screenName, setScreenName] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const { mutate, error, isPending } = api.social.create.useMutation({
    onSuccess: () => {
      router.push(`/socials/${screenName}`);
      router.refresh();
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
  const descriptionErrors: string[] = [];
  if (error?.data?.zodError?.fieldErrors.description !== undefined) {
    descriptionErrors.push(...error.data.zodError.fieldErrors.description);
  }

  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          mutate({
            screenName,
            name,
            image: image === "" ? undefined : image,
            description: description === "" ? undefined : description,
          });
        }}
      >
        <label className="form-control mx-auto w-full max-w-xs">
          <span className="label">ID</span>
          <input
            type="text"
            placeholder="social_id"
            className={`input input-bordered w-full max-w-xs ${clsx({ "input-error": screenNameErrors.length > 0 })}`}
            value={screenName ?? ""}
            onChange={(e) => setScreenName(e.target.value)}
            required
          />
          <InputErrorMessages errMsgs={screenNameErrors} />
        </label>
        <label className="form-control mx-auto w-full max-w-xs">
          <span className="label">名前</span>
          <input
            type="text"
            placeholder="ソーシャル名"
            className={`input input-bordered w-full max-w-xs ${clsx({ "input-error": nameErrors.length > 0 })}`}
            value={name ?? ""}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <InputErrorMessages errMsgs={nameErrors} />
        </label>
        <label className="form-control mx-auto w-full max-w-xs">
          <span className="label">アイコン画像URL</span>
          <input
            type="text"
            placeholder="https://example.com/icon.jpg"
            className={`input input-bordered w-full max-w-xs ${clsx({ "input-error": imageErrors.length > 0 })}`}
            value={image ?? ""}
            onChange={(e) => setImage(e.target.value)}
          />
          <InputErrorMessages errMsgs={imageErrors} />
        </label>
        <label className="form-control mx-auto w-full max-w-xs">
          <span className="label">説明</span>
          <textarea
            placeholder="ソーシャルの説明。"
            className={`textarea textarea-bordered w-full max-w-xs ${clsx({ "input-error": descriptionErrors.length > 0 })}`}
            value={description ?? ""}
            onChange={(e) => setDescription(e.target.value)}
          />
          <InputErrorMessages errMsgs={descriptionErrors} />
        </label>
        <div className="form-control mx-auto mt-7 w-full max-w-xs">
          <input
            type="submit"
            value={isPending ? "作成中…" : "作成"}
            className="btn btn-primary btn-block rounded-full"
            disabled={isPending}
          />
        </div>
      </form>
    </>
  );
}
