/**
 * The viewer's own words, in the reader's language. Words sent to the AI stay
 * English; these are only what the reader sees on the page.
 */
const EN = {
  draw: "✎ Draw",
  drawTitle: "Draw on the sketch",
  svgTitle: "Download as SVG",
  pngTitle: "Download as PNG",
  excalidrawTitle: "Download for Excalidraw",
  fullscreen: "Toggle fullscreen",
  pen: "Pen",
  penTitle: "Red pen",
  marker: "Marker",
  markerTitle: "Highlighter",
  text: "Text",
  textTitle: "Write a note: click where it goes",
  eraser: "Eraser",
  eraserTitle: "Erase marks: click or drag over them",
  undo: "Undo",
  undoTitle: "Undo (Ctrl+Z)",
  clear: "Clear",
  clearTitle: "Remove all marks",
  done: "Done",
  doneTitle: "Leave drawing mode",
  ask: "Ask about your marks…",
  send: "Send to AI",
  previous: "Previous step",
  next: "Next step",
  walk: "Walk through {n} steps",
  note: "Note…",
  saved: "Saved to {path}",
  noExport: "Export is not available here.",
  noLoad: "Sketchy could not load this drawing.",
  noDraw: "Sketchy could not draw this.",
  sketching: "Sketching…",
  empty: "No drawing embedded.",
};

const KO: typeof EN = {
  draw: "✎ 그리기",
  drawTitle: "그림 위에 표시하기",
  svgTitle: "SVG로 내려받기",
  pngTitle: "PNG로 내려받기",
  excalidrawTitle: "Excalidraw용으로 내려받기",
  fullscreen: "전체 화면 켜고 끄기",
  pen: "펜",
  penTitle: "빨간 펜",
  marker: "형광펜",
  markerTitle: "형광펜",
  text: "글",
  textTitle: "메모 쓰기: 쓸 곳을 누르세요",
  eraser: "지우개",
  eraserTitle: "표시 지우기: 누르거나 끌어서 지워요",
  undo: "되돌리기",
  undoTitle: "되돌리기 (Ctrl+Z)",
  clear: "모두 지우기",
  clearTitle: "표시를 모두 지워요",
  done: "마침",
  doneTitle: "그리기 끝내기",
  ask: "표시한 곳에 대해 물어보세요…",
  send: "AI에게 보내기",
  previous: "앞 단계",
  next: "다음 단계",
  walk: "{n}단계로 따라가기",
  note: "메모…",
  saved: "{path}에 저장했어요",
  noExport: "여기서는 내보낼 수 없어요.",
  noLoad: "그림을 불러오지 못했어요.",
  noDraw: "그림을 그리지 못했어요.",
  sketching: "그리는 중…",
  empty: "담긴 그림이 없어요.",
};

/** The dictionary for a browser language tag; anything but Korean reads English. */
export function stringsFor(language: string | undefined): typeof EN {
  return language?.toLowerCase().startsWith("ko") ? KO : EN;
}

const strings = stringsFor(typeof navigator === "undefined" ? undefined : navigator.language);

export function t(key: keyof typeof EN, values: Record<string, string | number> = {}): string {
  return strings[key].replace(/\{(\w+)\}/g, (_, name: string) => String(values[name] ?? ""));
}
