import { fmtDuration, fmtBytes, fmtCount } from "../format";

describe("fmtDuration", () => {
  it("formats seconds only", () => {
    expect(fmtDuration(45)).toBe("0:45");
  });

  it("formats minutes and seconds", () => {
    expect(fmtDuration(125)).toBe("2:05");
  });

  it("formats hours, minutes, seconds", () => {
    expect(fmtDuration(3661)).toBe("1:01:01");
  });

  it("formats zero", () => {
    expect(fmtDuration(0)).toBe("0:00");
  });

  it("formats exactly one hour", () => {
    expect(fmtDuration(3600)).toBe("1:00:00");
  });

  it("formats exactly one minute", () => {
    expect(fmtDuration(60)).toBe("1:00");
  });
});

describe("fmtBytes", () => {
  it("returns null for null/0", () => {
    expect(fmtBytes(null)).toBeNull();
    expect(fmtBytes(0)).toBeNull();
  });

  it("formats kilobytes", () => {
    expect(fmtBytes(512)).toBe("1KB");
    expect(fmtBytes(1024)).toBe("1KB");
    expect(fmtBytes(1536)).toBe("2KB");
  });

  it("formats megabytes", () => {
    expect(fmtBytes(1048576)).toBe("1MB");
    expect(fmtBytes(2097152)).toBe("2MB");
    expect(fmtBytes(5242880)).toBe("5MB");
  });
});

describe("fmtCount", () => {
  it("returns raw number under 1000", () => {
    expect(fmtCount(0)).toBe("0");
    expect(fmtCount(999)).toBe("999");
  });

  // Intl puts a non-breaking space before the suffix; normalize it for readable assertions.
  const plain = (n: number) => fmtCount(n).replace(/\s/g, " ");

  it("uses Indonesian suffixes for thousands, millions, and billions", () => {
    expect(plain(1500)).toBe("1,5 rb");
    expect(plain(2500000)).toBe("2,5 jt");
    expect(plain(1831543944)).toBe("1,8 M");
  });
});
