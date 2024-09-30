export function InputErrorMessages({
  errMsgs,
}: {
  errMsgs: string[] | undefined;
}) {
  return errMsgs !== undefined && errMsgs.length > 0 ? (
    <ul className="label my-auto block">
      {errMsgs.map((errMsg, i) => (
        <li key={i} className="label-text-alt text-error">
          {errMsg}
        </li>
      ))}
    </ul>
  ) : (
    <></>
  );
}
