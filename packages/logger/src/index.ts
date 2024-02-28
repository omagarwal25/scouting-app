import chalk from "chalk";
import { SingleBar } from "cli-progress";
import gradient from "gradient-string";

const infoBox = (content: string) =>
  chalk.bgBlueBright.white.bold(` ${content} `);
const warnBox = (content: string) =>
  chalk.bgYellowBright.black.bold(` ${content} `);
const errorBox = (content: string) =>
  chalk.bgRedBright.white.bold(` ${content} `);

const messageWithBox = (box: string, message: string) => `${box} ${message}`;
const messageWithTwoBoxes = (box1: string, box2: string, message: string) =>
  `${box1} ${box2} ${message}`;

export const infoMessage = (message: string) =>
  messageWithBox(infoBox(" INFO "), message);
export const infoMessageWithHeading = (heading: string, message: string) =>
  messageWithTwoBoxes(infoBox(" INFO "), infoBox(heading), message);

export const warnMessage = (message: string) =>
  messageWithBox(warnBox(" WARN "), message);
export const warnMessageWithHeading = (heading: string, message: string) =>
  messageWithTwoBoxes(warnBox(" WARN "), warnBox(heading), message);

export const errorMessage = (message: string) =>
  messageWithBox(errorBox(" ERROR "), message);
export const errorMessageWithHeading = (heading: string, message: string) =>
  messageWithTwoBoxes(errorBox(" ERROR "), errorBox(heading), message);

export const logInfo = (message: string) => console.log(infoMessage(message));
export const logInfoWithHeading = (heading: string, message: string) =>
  console.log(infoMessageWithHeading(heading, message));

export const logWarn = (message: string) => console.log(warnMessage(message));
export const logWarnWithHeading = (heading: string, message: string) =>
  console.log(warnMessageWithHeading(heading, message));

export const logError = (message: string) => console.log(errorMessage(message));
export const logErrorWithHeading = (heading: string, message: string) =>
  console.log(errorMessageWithHeading(heading, message));

export const changeableLog = (message: string) => {
  process.stdout.write(`\r${message}`);

  return {
    update: (newMessage: string) => {
      process.stdout.write(`\r${newMessage}`);
    },
    end: () => {
      process.stdout.write("\n");
    },
  };
};

const barCompleteChar = "\u2588";
const barIncompleteChar = "\u2591";

export const intervalWithBar = async (
  fn: () => Promise<void>,
  interval: number
) => {
  const update = async () => {
    const bar = new SingleBar({
      format: "|{bar}| {percentage}% | Next update in {eta_formatted}",
      barCompleteChar,
      barIncompleteChar,
      noTTYOutput: true,
      notTTYSchedule: 10,
      hideCursor: true,
      formatBar: (progress, options) => {
        const completeSize = Math.round(progress * options.barsize!);
        const incompleteSize = options.barsize! - completeSize;

        // generate bar string by stripping the pre-rendered strings
        return gradient.morning(
          options.barCompleteString!.substring(0, completeSize) +
          options.barGlue +
          options.barIncompleteString!.substring(0, incompleteSize)
        );
      },
    });

    bar.start(interval, 0);

    await new Promise((resolve) => {
      const interval = setInterval(async () => {
        bar.increment(10);

        if (bar.getProgress() >= 1) {
          bar.stop();
          clearInterval(interval);
          await fn();
          resolve(null);
        }
      }, 10);
    });
  };

  while (true) await update();
};
