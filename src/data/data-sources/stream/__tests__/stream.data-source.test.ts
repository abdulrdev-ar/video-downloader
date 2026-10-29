import { contentDisposition, isAllowedHost } from "../stream.data-source";

// youtubei.js ships ESM only; these tests never reach YouTube.
jest.mock("@/core/services/youtube-client", () => ({}));

describe("isAllowedHost", () => {
  it.each([
    "https://rr3---sn-abc.googlevideo.com/videoplayback?x=1",
    "https://video.twimg.com/ext_tw_video/1/pu/vid/720x1280/a.mp4",
    "https://scontent.cdninstagram.com/v/a.jpg",
    "https://d.rapidcdn.app/v2?token=abc",
    "https://www.tikwm.com/video/media/play/1.mp4",
  ])("allows %s", (url) => {
    expect(isAllowedHost(url)).toBe(true);
  });

  it.each([
    "http://video.twimg.com/a.mp4",
    "https://evilfbcdn.net/a.mp4",
    "https://fbcdn.net.evil.com/a.mp4",
    "https://169.254.169.254/latest/meta-data",
    "https://localhost/a.mp4",
    "not a url",
  ])("refuses %s", (url) => {
    expect(isAllowedHost(url)).toBe(false);
  });
});

describe("contentDisposition", () => {
  it("keeps an ASCII fallback and the UTF-8 name", () => {
    expect(contentDisposition('Lagu "baru" ✨.mp4', false)).toBe(
      `attachment; filename="Lagu baru _.mp4"; filename*=UTF-8''Lagu%20%22baru%22%20%E2%9C%A8.mp4`
    );
  });

  it("uses inline for previews", () => {
    expect(contentDisposition("a.jpg", true)).toMatch(/^inline;/);
  });
});
