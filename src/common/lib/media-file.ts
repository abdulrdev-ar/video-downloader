// Browser-only helpers for turning a stream response into a saved file.

export function streamUrl(token: string, inline = false): string {
  return `/internal/stream?t=${encodeURIComponent(token)}${inline ? "&inline=1" : ""}`;
}

/** Downloads a stream token into memory, reporting bytes as they arrive. */
export async function fetchWithProgress(
  token: string,
  onProgress: (received: number, total?: number) => void,
  signal: AbortSignal
): Promise<Blob> {
  const response = await fetch(streamUrl(token), { signal });
  if (!response.ok || !response.body) {
    const payload = await response.json().catch(() => null);
    throw new Error(
      payload?.message ?? `Server menjawab HTTP ${response.status}.`
    );
  }

  const total = Number(response.headers.get("content-length")) || undefined;
  const reader = response.body.getReader();
  const chunks: BlobPart[] = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    onProgress(received, total);
  }
  return new Blob(chunks, {
    type: response.headers.get("content-type") ?? "application/octet-stream",
  });
}

/** Copies a video-only and an audio-only MP4 into one file without re-encoding. */
export async function mergeVideoAudio(video: Blob, audio: Blob): Promise<Blob> {
  const mb = await import("mediabunny");
  const videoTrack = await new mb.Input({
    source: new mb.BlobSource(video),
    formats: mb.ALL_FORMATS,
  }).getPrimaryVideoTrack();
  const audioTrack = await new mb.Input({
    source: new mb.BlobSource(audio),
    formats: mb.ALL_FORMATS,
  }).getPrimaryAudioTrack();
  if (!videoTrack?.codec || !audioTrack?.codec) {
    throw new Error("File video atau audio tidak bisa dibaca untuk digabung.");
  }

  const output = new mb.Output({
    format: new mb.Mp4OutputFormat({ fastStart: "in-memory" }),
    target: new mb.BufferTarget(),
  });
  const videoSource = new mb.EncodedVideoPacketSource(videoTrack.codec);
  const audioSource = new mb.EncodedAudioPacketSource(audioTrack.codec);
  output.addVideoTrack(videoSource, { rotation: videoTrack.rotation });
  output.addAudioTrack(audioSource);
  await output.start();

  const videoConfig = await videoTrack.getDecoderConfig();
  const audioConfig = await audioTrack.getDecoderConfig();
  await Promise.all([
    (async () => {
      let first = true;
      for await (const packet of new mb.EncodedPacketSink(
        videoTrack
      ).packets()) {
        await videoSource.add(
          packet,
          first && videoConfig ? { decoderConfig: videoConfig } : undefined
        );
        first = false;
      }
      videoSource.close();
    })(),
    (async () => {
      let first = true;
      for await (const packet of new mb.EncodedPacketSink(
        audioTrack
      ).packets()) {
        await audioSource.add(
          packet,
          first && audioConfig ? { decoderConfig: audioConfig } : undefined
        );
        first = false;
      }
      audioSource.close();
    })(),
  ]);
  await output.finalize();
  return new Blob([output.target.buffer!], { type: "video/mp4" });
}

/** Keeps only the audio track of a video, copied as-is into an .m4a file. */
export async function extractAudio(video: Blob): Promise<Blob> {
  const mb = await import("mediabunny");
  const output = new mb.Output({
    format: new mb.Mp4OutputFormat({ fastStart: "in-memory" }),
    target: new mb.BufferTarget(),
  });
  const conversion = await mb.Conversion.init({
    input: new mb.Input({
      source: new mb.BlobSource(video),
      formats: mb.ALL_FORMATS,
    }),
    output,
    video: { discard: true },
    showWarnings: false,
  });
  if (!conversion.isValid)
    throw new Error("Video ini tidak punya track audio.");
  await conversion.execute();
  return new Blob([output.target.buffer!], { type: "audio/mp4" });
}

/** Re-encodes an image to JPG or PNG with a canvas. */
export async function convertImage(
  image: Blob,
  format: "jpg" | "png"
): Promise<Blob> {
  const bitmap = await createImageBitmap(image);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Browser ini tidak bisa mengonversi gambar.");
  if (format === "jpg") {
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
  }
  context.drawImage(bitmap, 0, 0);
  bitmap.close();
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Konversi gambar gagal.")),
      format === "jpg" ? "image/jpeg" : "image/png",
      0.92
    )
  );
}

export function saveBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
