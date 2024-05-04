"use client";

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { useState } from "react";
import { InputErrorMessages } from "~/app/_components/input-error-messages";
import clsx from "clsx";

export function SignupForm({userId}: {userId: string}) {
  const router = useRouter();
  const [screenName, setScreenName] = useState('');
  const { mutate, error } = api.user.update.useMutation({
    onSuccess: () => {
      router.push(`/`);
    },
  });
  const screenNameErrors = error?.data?.zodError?.fieldErrors.screenName;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        mutate({
          id: userId,
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
          value="保存"
          className="btn btn-primary btn-block"
        />
      </div>
    </form>
  );
}
