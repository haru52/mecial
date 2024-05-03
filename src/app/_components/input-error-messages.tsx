export function InputErrorMessages({
  errMsgs,
}: {
  errMsgs: string[] | undefined;
}) {
  return errMsgs ? (
    <ul className="block label my-auto">
      {errMsgs.map((errMsg, i) => (
        <li key={i} className="label-text-alt text-error">{errMsg}</li>
      ))}
    </ul>
  ) : (
    <></>
  );
}
