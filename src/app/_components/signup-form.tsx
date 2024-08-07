"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { InputErrorMessages } from "~/app/_components/input-error-messages";
import { api } from "~/trpc/react";

export function SignupForm() {
  const router = useRouter();
  const [screenName, setScreenName] = useState("");
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

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        setIsDisabled(true);
        mutate({
          screenName,
        });
      }}
    >
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
      <div className="form-control mx-auto mt-7 w-full max-w-xs">
        <input
          type="submit"
          value={isDisabled ? "サインアップ中…" : "サインアップ"}
          className="btn btn-primary btn-block rounded-full"
          disabled={isDisabled || screenName.length === 0}
        />
      </div>
    </form>
  );
}
