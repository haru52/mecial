"use client";

import type { SocialWithAvatarUsersAndAdministrator } from "~/entities/social";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { InputErrorMessages } from "./input-error-messages";
import { screenNameRule } from "~/consts";
import clsx from "clsx";

export function SocialEdit({
  social,
}: {
  social: SocialWithAvatarUsersAndAdministrator;
}) {
  const [isDisabled, setIsDisabled] = useState(false);
  const [screenName, setScreenName] = useState(social.screenName);
  const [name, setName] = useState(social.name);
  const [image, setImage] = useState(social.image ?? "");
  const [description, setDescription] = useState(social.description ?? "");
  const [url, setUrl] = useState(social.url ?? "");

  const router = useRouter();
  const updateSocial = api.social.update.useMutation({
    onSuccess: () => {
      router.push(`/socials/${screenName}`);
      router.refresh();
    },
    onError: () => {
      setIsDisabled(false);
    },
  });

  const screenNameErrors: string[] = [];
  if (
    updateSocial.error?.data?.zodError?.fieldErrors.screenName !== undefined
  ) {
    screenNameErrors.push(
      ...updateSocial.error.data.zodError.fieldErrors.screenName,
    );
  }
  if (
    updateSocial.error !== null &&
    updateSocial.error?.data?.zodError == null
  ) {
    screenNameErrors.push(updateSocial.error.message);
  }
  const nameErrors = updateSocial.error?.data?.zodError?.fieldErrors.name;
  const imageErrors = updateSocial.error?.data?.zodError?.fieldErrors.image;
  const descriptionErrors =
    updateSocial.error?.data?.zodError?.fieldErrors.description;
  const urlErrors = updateSocial.error?.data?.zodError?.fieldErrors.url;

  const [requiredAreFilled, setRequiredAreFilled] = useState(false);

  useEffect(() => {
    setRequiredAreFilled(screenName.trim() !== "" && name.trim() !== "");
  }, [screenName, name]);

  return (
    <>
      <h1 className="text-center">{social.name}を編集</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsDisabled(true);
          updateSocial.mutate({
            id: social.id,
            screenName,
            name,
            image: image === "" ? null : image,
            description: description === "" ? null : description,
            url: url === "" ? null : url,
          });
        }}
      >
        <label className="form-control mx-auto w-full max-w-xs">
          <span className="label label-text">ID</span>
          <input
            type="text"
            className={`input input-bordered w-full max-w-xs ${clsx({ "input-error": screenNameErrors !== undefined && screenNameErrors.length > 0 })}`}
            value={screenName}
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
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <InputErrorMessages errMsgs={nameErrors} />
        </label>
        <label className="form-control mx-auto w-full max-w-xs">
          <span className="label label-text">アイコン画像URL</span>
          <input
            type="text"
            className={`input input-bordered w-full max-w-xs ${clsx({ "input-error": imageErrors !== undefined })}`}
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          <InputErrorMessages errMsgs={imageErrors} />
        </label>
        <label className="form-control mx-auto w-full max-w-xs">
          <span className="label label-text">説明</span>
          <textarea
            className={`input input-bordered w-full max-w-xs ${clsx({ "input-error": descriptionErrors !== undefined })}`}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <InputErrorMessages errMsgs={descriptionErrors} />
        </label>
        <label className="form-control mx-auto w-full max-w-xs">
          <span className="label label-text">URL</span>
          <input
            type="text"
            className={`input input-bordered w-full max-w-xs ${clsx({ "input-error": urlErrors !== undefined })}`}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <InputErrorMessages errMsgs={urlErrors} />
        </label>
        <div className="mx-auto mt-5 flex w-full max-w-xs space-x-4">
          <input
            type="submit"
            className="btn btn-primary flex-1 rounded-full"
            value={isDisabled ? "保存中…" : "保存"}
            disabled={!requiredAreFilled || isDisabled}
          ></input>
          <button
            className="btn flex-1 rounded-full"
            onClick={(e) => {
              e.preventDefault();
              router.push(`/socials/${social.screenName}`);
            }}
          >
            キャンセル
          </button>
        </div>
      </form>
    </>
  );
}
