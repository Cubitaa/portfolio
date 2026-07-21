module.exports = {
  apps: [
    {
      name: "portfolio-site",
      script: "./dist/server/entry.mjs",
      cwd: __dirname,
      env: {
        HOST: "127.0.0.1",
        PORT: "4321",
        NODE_ENV: "production",
      },
      autorestart: true,
    },
    {
      name: "portfolio-tunnel",
      script: "C:/Program Files (x86)/cloudflared/cloudflared.exe",
      args: "tunnel --url http://127.0.0.1:4321 --no-autoupdate",
      cwd: __dirname,
      autorestart: true,
    },
  ],
};
