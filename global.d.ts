declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "production" | "test";
      BOT_TOKEN: string;
      GROUP_ID_TO_TAKE_MEMES_FROM: string;
      GROUP_ID_TO_POST_SUGGESTIONS: string;
      TOPIC_ID_TO_SUBSCRIBE_TO_REACTIONS_FROM: string;
    }
  }
}

export {};
