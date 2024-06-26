"use client";

import type { SocialWithAvatarUsersAndAdministrator } from "~/entities/social";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { api } from "~/trpc/react";
import { InputErrorMessages } from "./input-error-messages";

export function SocialEdit({
  social,
  setIsEditing,
}: {
  social: SocialWithAvatarUsersAndAdministrator;
  setIsEditing: (isEditing: boolean) => void;
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
      setIsEditing(false);
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

  return (
    <>
      <h1>{social.name} を編集</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setIsDisabled(true);
          updateSocial.mutate({
            id: social.id,
            screenName,
            name,
            image: image === "" ? undefined : image,
            description: description === "" ? undefined : description,
            url: url === "" ? undefined : url,
          });
        }}
      >
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">名前</span>
          </div>
          <input
            type="text"
            placeholder="コルサント"
            className="input input-bordered w-full max-w-xs"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <InputErrorMessages errMsgs={nameErrors} />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">ID</span>
          </div>
          <input
            type="text"
            placeholder="coruscant"
            className="input input-bordered w-full max-w-xs"
            value={screenName}
            onChange={(e) => setScreenName(e.target.value)}
            required
          />
          <InputErrorMessages errMsgs={screenNameErrors} />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">アイコン画像URL</span>
          </div>
          <input
            type="text"
            placeholder="https://coruscant.com/coruscant.png"
            className="input input-bordered w-full max-w-xs"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          <InputErrorMessages errMsgs={imageErrors} />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">説明</span>
          </div>
          <textarea
            placeholder="ソーシャルの説明文。"
            className="textarea textarea-bordered h-24 w-full max-w-xs"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <InputErrorMessages errMsgs={descriptionErrors} />
        </label>
        <label className="form-control w-full max-w-xs">
          <div className="label">
            <span className="label-text">URL</span>
          </div>
          <input
            type="text"
            placeholder="https://coruscant.com/"
            className="input input-bordered w-full max-w-xs"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <InputErrorMessages errMsgs={urlErrors} />
        </label>
        <input
          type="submit"
          className="btn btn-primary"
          value={isDisabled ? "保存中…" : "保存"}
          disabled={isDisabled}
        ></input>
        <button
          className="btn"
          onClick={() => {
            setIsEditing(false);
          }}
        >
          キャンセル
        </button>
      </form>
    </>
  );
}
