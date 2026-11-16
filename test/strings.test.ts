import { describe, expect, it } from "vitest";
import { stringsFor } from "../viewer/src/strings.js";

describe("viewer strings", () => {
  it("reads Korean for a Korean browser and English otherwise", () => {
    expect(stringsFor("ko-KR").walk).toBe("{n}단계로 따라가기");
    expect(stringsFor("ko").send).toBe("AI에게 보내기");
    expect(stringsFor("en-US").walk).toBe("Walk through {n} steps");
    expect(stringsFor(undefined).done).toBe("Done");
  });

  it("has every word in both languages, with the same blanks", () => {
    const en = stringsFor("en");
    const ko = stringsFor("ko");
    const blanks = (text: string) => (text.match(/\{\w+\}/g) ?? []).sort().join();
    for (const key of Object.keys(en) as (keyof typeof en)[]) {
      expect(ko[key], key).toBeTruthy();
      expect(blanks(ko[key]), key).toBe(blanks(en[key]));
    }
  });
});
