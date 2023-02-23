import trpc from "@trpc/server";

export const createContext = () => {
  // prisma.$on("query", (e) => {
  //   console.log("Query: " + e.query);
  //   console.log("Duration: " + e.duration + "ms");
  // });

  return {};
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
