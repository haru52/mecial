"use client";

import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { InputErrorMessages } from "~/app/_components/input-error-messages";
import { imageUrlRuleMessage, screenNameRule } from "~/consts";

export function CreateSocialForm() {
  const router = useRouter();
  const [screenName, setScreenName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
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
  const urlErrors: string[] = [];
  if (error?.data?.zodError?.fieldErrors.url !== undefined) {
    urlErrors.push(...error.data.zodError.fieldErrors.url);
  }
  const descriptionErrors: string[] = [];
  if (error?.data?.zodError?.fieldErrors.description !== undefined) {
    descriptionErrors.push(...error.data.zodError.fieldErrors.description);
  }

  const [requiredAreFilled, setRequiredAreFilled] = useState(false);

  useEffect(() => {
    setRequiredAreFilled(screenName.trim() !== "" && name.trim() !== "");
  }, [screenName, name]);

  return (
    <>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          mutate({
            screenName,
            isPrivate,
            name,
            image: image === "" ? undefined : image,
            url: url === "" ? undefined : url,
            description: description === "" ? undefined : description,
          });
        }}
        className="mx-auto max-w-xs"
      >
        <div className="form-control max-w-24">
          <label className="label cursor-pointer">
            <span className="label-text">非公開</span>
            <input
              type="checkbox"
              className="checkbox"
              checked={isPrivate}
              onChange={(e) => setIsPrivate(e.target.checked)}
            />
          </label>
        </div>
        <label className="form-control mx-auto w-full max-w-xs">
          <span className="label label-text">ID</span>
          <input
            type="text"
            className={`input input-bordered w-full max-w-xs ${clsx({ "input-error": screenNameErrors.length > 0 })}`}
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
            className={`input input-bordered w-full max-w-xs ${clsx({ "input-error": nameErrors.length > 0 })}`}
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
            className={`input input-bordered w-full max-w-xs ${clsx({ "input-error": imageErrors.length > 0 })}`}
            value={image ?? ""}
            onChange={(e) => setImage(e.target.value)}
          />
          <span className="label label-text-alt">{imageUrlRuleMessage}</span>
          <InputErrorMessages errMsgs={imageErrors} />
        </label>
        <label className="form-control mx-auto w-full max-w-xs">
          <span className="label label-text">説明</span>
          <textarea
            className={`textarea textarea-bordered w-full max-w-xs ${clsx({ "input-error": descriptionErrors.length > 0 })}`}
            value={description ?? ""}
            onChange={(e) => setDescription(e.target.value)}
          />
          <InputErrorMessages errMsgs={descriptionErrors} />
        </label>
        <label className="form-control mx-auto w-full max-w-xs">
          <span className="label label-text">ウェブサイト</span>
          <input
            type="text"
            className={`input input-bordered w-full max-w-xs ${clsx({ "input-error": urlErrors.length > 0 })}`}
            value={url ?? ""}
            onChange={(e) => setUrl(e.target.value)}
          />
          <InputErrorMessages errMsgs={urlErrors} />
        </label>
        <div className="form-control mx-auto mt-7 w-full max-w-xs">
          <input
            type="submit"
            value={isPending ? "作成中…" : "作成"}
            className="btn btn-primary btn-block rounded-full"
            disabled={!requiredAreFilled || isPending}
          />
        </div>
      </form>
    </>
  );
}
