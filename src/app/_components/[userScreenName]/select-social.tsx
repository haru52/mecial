import type { Social } from "~/entities/social";

export function SelectSocial({
  socials,
  currentSocialId,
}: {
  socials: Social[];
  currentSocialId: number | null;
}) {
  return (
    <>
      <h2>現在のソーシャル</h2>
      <form>
        <select name="socialId" className="select w-full max-w-xs">
          {socials.map((social) => (
            <option
              key={social.id}
              value={social.id}
              selected={social.id === currentSocialId}
            >
              {social.name}
            </option>
          ))}
        </select>
        <div className="form-control mt-5 w-full max-w-xs">
          <input
            type="submit"
            value="保存"
            className="btn btn-primary btn-block"
          />
        </div>
      </form>
    </>
  );
}
