// src/utils/scroll.js
export function getScrollContainer() {
  // 1) попробуем найти скроллера среди ближайших к main родителей
  const main = document.querySelector("main");
  for (let el = main?.parentElement; el; el = el.parentElement) {
    const cs = getComputedStyle(el);
    const canScroll =
      /(auto|scroll|overlay)/.test(cs.overflowY) &&
      el.scrollHeight > el.clientHeight;
    if (canScroll) return el;
  }

  // 2) fallback: типичные кандидаты
  const list = [
    document.getElementById("root"),
    document.querySelector("#root"),
    document.scrollingElement,
    document.documentElement,
    document.body,
  ].filter(Boolean);

  for (const el of list) {
    const cs = getComputedStyle(el);
    const canScroll =
      /(auto|scroll|overlay)/.test(cs.overflowY) &&
      el.scrollHeight > el.clientHeight;
    if (canScroll) return el;
  }

  // 3) самый последний запасной вариант
  return document.scrollingElement || document.documentElement;
}

export function scrollToTop(behavior = "smooth") {
  const el = getScrollContainer();
  if (typeof el.scrollTo === "function") {
    el.scrollTo({ top: 0, left: 0, behavior });
  } else {
    el.scrollTop = 0;
  }
}
