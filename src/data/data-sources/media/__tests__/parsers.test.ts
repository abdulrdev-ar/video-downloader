import { decodeSnapSaveResponse, mapSnapSave } from "../facebook.data-source";
import { mapInstagramEmbed, readEmbedContext } from "../instagram.data-source";
import { mapLoveThreads } from "../threads.data-source";
import { mapTikwm } from "../tiktok.data-source";
import { mapSyndication, syndicationToken } from "../twitter.data-source";

const kinds = (files: { kind: string; label: string }[]) =>
  files.map((file) => `${file.kind}:${file.label}`);

describe("mapTikwm", () => {
  it("lists no-watermark variants first and skips duplicates", () => {
    const media = mapTikwm("https://vt.tiktok.com/x/", {
      code: 0,
      data: {
        title: "Pose ideas\nkedua",
        hdplay: "/video/media/hdplay/1.mp4",
        play: "/video/media/play/1.mp4",
        wmplay: "/video/media/play/1.mp4",
        music: "https://sf16.tiktokcdn.com/a.mp3",
        author: { unique_id: "rina" },
      },
    });
    expect(kinds(media.files)).toEqual([
      "video:HD",
      "video:Standar",
      "audio:Audio",
    ]);
    expect(media.files[0].source).toMatchObject({
      url: "https://www.tikwm.com/video/media/hdplay/1.mp4",
    });
    expect(media.title).toBe("Pose ideas");
    expect(media.author).toBe("@rina");
  });

  it("returns every photo of a slideshow post", () => {
    const media = mapTikwm("https://www.tiktok.com/@a/photo/1", {
      code: 0,
      data: {
        images: [
          "https://p16.tiktokcdn.com/1.jpeg",
          "https://p16.tiktokcdn.com/2.jpeg",
        ],
        play: "x",
      },
    });
    expect(kinds(media.files)).toEqual(["image:Foto 1", "image:Foto 2"]);
  });

  it("explains a refused post", () => {
    expect(() =>
      mapTikwm("u", { code: -1, msg: "Url parsing is failed!" })
    ).toThrow(/publik/);
  });
});

describe("mapSyndication", () => {
  it("sorts mp4 variants by bitrate and labels the resolution", () => {
    const media = mapSyndication("https://x.com/a/status/1", {
      text: "Entering HQ https://t.co/D68z4K2wq7",
      user: { screen_name: "elonmusk" },
      mediaDetails: [
        {
          type: "video",
          media_url_https: "https://pbs.twimg.com/a.jpg",
          video_info: {
            duration_millis: 12_000,
            variants: [
              {
                content_type: "application/x-mpegURL",
                url: "https://video.twimg.com/a.m3u8",
              },
              {
                content_type: "video/mp4",
                bitrate: 256_000,
                url: "https://video.twimg.com/vid/480x270/a.mp4",
              },
              {
                content_type: "video/mp4",
                bitrate: 2_176_000,
                url: "https://video.twimg.com/vid/1280x720/b.mp4",
              },
            ],
          },
        },
      ],
    });
    expect(kinds(media.files)).toEqual([
      "video:720p",
      "video:270p",
      "audio:Audio",
    ]);
    expect(media.title).toBe("Entering HQ");
    expect(media.duration).toBe(12);
  });

  it("asks for the original photo size", () => {
    const media = mapSyndication("u", {
      mediaDetails: [
        { type: "photo", media_url_https: "https://pbs.twimg.com/media/a.png" },
      ],
    });
    expect(media.files[0]).toMatchObject({
      kind: "image",
      ext: "png",
      source: { url: "https://pbs.twimg.com/media/a.png?name=orig" },
    });
  });

  it("matches the token the embed widget sends", () => {
    expect(syndicationToken("20")).toMatch(/^[a-z0-9]+$/);
  });
});

describe("Instagram embed", () => {
  const embed = (media: object) =>
    `<script>{"contextJSON":${JSON.stringify(JSON.stringify({ gql_data: { shortcode_media: media } }))}}</script>`;

  it("reads a Reel with its audio", () => {
    const media = mapInstagramEmbed(
      "https://www.instagram.com/reel/A/",
      embed({
        is_video: true,
        video_url: "https://instagram.fcgk15-1.fna.fbcdn.net/v.mp4",
        display_url: "https://instagram.fcgk15-1.fna.fbcdn.net/c.jpg",
        owner: { username: "9gag" },
        edge_media_to_caption: {
          edges: [{ node: { text: "In another life" } }],
        },
      })
    );
    expect(kinds(media.files)).toEqual(["video:Video", "audio:Audio"]);
    expect(media.files[1].extractAudio).toBe(true);
    expect(media.author).toBe("@9gag");
  });

  it("splits a carousel into photos and videos", () => {
    const media = mapInstagramEmbed(
      "u",
      embed({
        edge_sidecar_to_children: {
          edges: [
            {
              node: { display_url: "https://scontent.cdninstagram.com/1.jpg" },
            },
            {
              node: {
                is_video: true,
                video_url: "https://scontent.cdninstagram.com/2.mp4",
              },
            },
            {
              node: { display_url: "https://scontent.cdninstagram.com/3.jpg" },
            },
          ],
        },
      })
    );
    expect(kinds(media.files)).toEqual([
      "image:Foto 1",
      "video:Video 1",
      "image:Foto 2",
    ]);
  });

  it("falls back to the embedded image when there is no context", () => {
    const html = `"contextJSON":null <img class="EmbeddedMediaImage" src="https://scontent.cdninstagram.com/p.jpg">`;
    expect(readEmbedContext(html)).toBeNull();
    expect(kinds(mapInstagramEmbed("u", html).files)).toEqual(["image:Foto 1"]);
  });

  it("reports a post with no media", () => {
    expect(() => mapInstagramEmbed("u", "<html></html>")).toThrow(/privat/);
  });
});

describe("SnapSave (Facebook)", () => {
  // Packs text the same way SnapSave does: base-N digits mapped to letters, shifted char codes.
  function pack(text: string): string {
    const alphabet = "abcdefghij";
    const base = 9;
    const shift = 3;
    const encoded = [...text]
      .map((char) =>
        (char.charCodeAt(0) + shift)
          .toString(base)
          .split("")
          .map((digit) => alphabet[Number(digit)])
          .join("")
      )
      .join(alphabet[base]);
    return `eval(function(){}("${encoded}",1,"${alphabet}",${shift},${base},0))`;
  }

  const decoded = (table: string) =>
    `document.getElementById("download-section").innerHTML = "${table.replaceAll('"', '\\"')}"; document.x()`;

  it("decodes the packed response", () => {
    expect(decodeSnapSaveResponse(pack("halo"))).toBe("halo");
  });

  it("reads each quality row that has a direct link", () => {
    const media = mapSnapSave(
      "u",
      decoded(
        `<article class="media"><img src="https://d.rapidcdn.app/thumb?t=1"></article><table><tbody>` +
          `<tr><td class="video-quality">720p (HD)</td><td>No</td><td><a href="https://d.rapidcdn.app/v2?token=hd">Download</a></td></tr>` +
          `<tr><td class="video-quality">1080p</td><td>Yes</td><td><button>Render</button></td></tr>` +
          `<tr><td class="video-quality">360p (SD)</td><td>No</td><td><a href="https://d.rapidcdn.app/v2?token=sd">Download</a></td></tr>` +
          `</tbody></table>`
      )
    );
    expect(kinds(media.files)).toEqual([
      "video:720p",
      "video:360p",
      "audio:Audio",
    ]);
    expect(media.files[0].detail).toBe("HD");
  });

  it("explains a private post", () => {
    expect(() =>
      mapSnapSave(
        "u",
        `document.querySelector("#alert").innerHTML = "Error: The video is private. Please use"`
      )
    ).toThrow(/privat/);
  });
});

describe("mapLoveThreads", () => {
  it("reads videos and photos from the result list", () => {
    const media = mapLoveThreads("https://www.threads.com/@rina/post/A", {
      status: "ok",
      data:
        `<ul class="download-box">` +
        `<li><i class="icon-dlvideo"></i><a title="Download Video" href="https://dl.snapcdn.app/v.mp4">v</a></li>` +
        `<li><i class="icon-dlimage"></i><select class="photo-option"><option value="https://dl.snapcdn.app/p.jpg"></option></select></li>` +
        `</ul>`,
    });
    expect(kinds(media.files)).toEqual([
      "video:Video 1",
      "image:Foto 1",
      "audio:Audio",
    ]);
    expect(media.author).toBe("@rina");
  });

  it("explains a private post", () => {
    expect(() =>
      mapLoveThreads("u", { status: "ok", mess: "Error: Post is private." })
    ).toThrow(/privat/);
  });
});
