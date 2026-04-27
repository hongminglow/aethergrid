export type TypewriterHandle = {
  start: () => void;
  stop: () => void;
  complete: () => void;
};

export type TypewriterOptions = {
  root: HTMLElement;
  lineSelector?: string;
  characterDelayMs?: number;
  lineDelayMs?: number;
  reducedMotion?: boolean;
  onProgress?: (progress: number) => void;
};

const wait = (delay: number) =>
  new Promise<void>((resolve) => {
    window.setTimeout(resolve, delay);
  });

export const createTypewriter = ({
  root,
  lineSelector = "[data-typewriter-line]",
  characterDelayMs = 26,
  lineDelayMs = 230,
  reducedMotion = false,
  onProgress
}: TypewriterOptions): TypewriterHandle => {
  const lines = Array.from(
    root.querySelectorAll<HTMLElement>(lineSelector)
  ).map((element) => ({
    element,
    text: element.dataset.typewriterText ?? element.textContent ?? ""
  }));
  const totalCharacters = Math.max(
    lines.reduce((total, line) => total + line.text.length, 0),
    1
  );
  let typedCharacters = 0;
  let isStopped = false;

  const setProgress = () => {
    onProgress?.(Math.min(typedCharacters / totalCharacters, 1));
  };

  const complete = () => {
    typedCharacters = totalCharacters;

    lines.forEach(({ element, text }) => {
      element.textContent = text;
      element.dataset.typewriterState = "complete";
    });

    root.dataset.typewriterStatus = "complete";
    setProgress();
  };

  const start = async () => {
    if (reducedMotion) {
      complete();

      return;
    }

    isStopped = false;
    typedCharacters = 0;
    root.dataset.typewriterStatus = "running";
    setProgress();

    for (const { element, text } of lines) {
      if (isStopped) {
        return;
      }

      element.textContent = "";
      element.dataset.typewriterState = "active";

      for (const character of text) {
        if (isStopped) {
          return;
        }

        element.textContent += character;
        typedCharacters += 1;
        setProgress();
        await wait(characterDelayMs);
      }

      element.dataset.typewriterState = "complete";
      await wait(lineDelayMs);
    }

    complete();
  };

  const stop = () => {
    isStopped = true;
  };

  return { start, stop, complete };
};
