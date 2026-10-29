import { SignatureManager } from "../encrypt-manager";

describe("SignatureManager", () => {
  const now = 1_000_000;
  const token = SignatureManager.sign(
    { s: { type: "url", url: "https://video.twimg.com/a.mp4" }, f: "a.mp4" },
    60_000,
    now
  );

  it("accepts its own token before expiry", () => {
    expect(SignatureManager.verify(token, now + 59_000)).toMatchObject({
      f: "a.mp4",
    });
  });

  it("rejects an expired token", () => {
    expect(SignatureManager.verify(token, now + 60_001)).toBeNull();
  });

  it("rejects a token whose payload was changed", () => {
    const [, signature] = token.split(".");
    const forged = Buffer.from(
      JSON.stringify({
        s: { type: "url", url: "https://169.254.169.254/" },
        f: "x",
        exp: now + 60_000,
      })
    ).toString("base64url");
    expect(SignatureManager.verify(`${forged}.${signature}`, now)).toBeNull();
  });

  it("rejects garbage", () => {
    expect(SignatureManager.verify("not-a-token", now)).toBeNull();
    expect(SignatureManager.verify(`${token}x`, now)).toBeNull();
  });
});
