interface IApp {
  app: {
    serverUrl: string;
    clientUrl: string;
    bucketUrl: string;
  };
}

interface IConfig {
  development: IApp;
  production: IApp;
}

const env = import.meta.env.REACT_APP_NODE_ENV ?? "development"; // Get the ENV state ( DEV / PROD )

const development: IApp = {
  app: {
    serverUrl:
      import.meta.env.REACT_APP_DEVELOPMENT_SERVER_URL ||
      "http://localhost:4000/",
    clientUrl:
      import.meta.env.REACT_APP_DEVELOPMENT_CLIENT_URL ||
      "http://localhost:3000/",
    bucketUrl:
      import.meta.env.REACT_APP_DEVELOPMENT_BUCKET_URL ||
      "https://resource.koena.app/",
  },
};

const production: IApp = {
  app: {
    serverUrl:
      import.meta.env.REACT_APP_PRODUCTION_SERVER_URL ||
      "https://api.koena.app/",
    clientUrl:
      import.meta.env.REACT_APP_PRODUCTION_CLIENT_URL ||
      "https://admin.koena.app/",
    bucketUrl:
      import.meta.env.REACT_APP_PRODUCTION_BUCKET_URL ||
      "https://resource.koena.app/",
  },
};

const config: IConfig = {
  development,
  production,
};

export default config[env as keyof IConfig]; // Export the required config
