"use client";

import type { SocialWithAvatarUsersAndAdministrator } from "~/entities/social";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
import { InputErrorMessages } from "./input-error-messages";
import { screenNameRule } from "~/consts";

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

  const screenNameErrors =
    updateSocial.error?.data?.zodError?.fieldErrors.screenName;
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
            className="input input-bordered w-full max-w-xs"
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
            className="input input-bordered w-full max-w-xs"
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
            className="input input-bordered w-full max-w-xs"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          <InputErrorMessages errMsgs={imageErrors} />
        </label>
        <label className="form-control mx-auto w-full max-w-xs">
          <span className="label label-text">説明</span>
          <textarea
            className="textarea textarea-bordered h-24 w-full max-w-xs"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <InputErrorMessages errMsgs={descriptionErrors} />
        </label>
        <label className="form-control mx-auto w-full max-w-xs">
          <span className="label label-text">URL</span>
          <input
            type="text"
            className="input input-bordered w-full max-w-xs"
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
