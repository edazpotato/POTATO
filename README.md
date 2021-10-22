# POTATO

Epic cool discord bot!

## History

-   V1 - My first ever discord bot, written in Discord.js
-   Then I stopped the project for like 2 years.
-   V2 - Rewrite after making some other bots, this time using Discord-Akairo
-   V3 - Rewrite using plain old Discord.js again so that I could add slash command support.

## Self hosting

1. Clone this repo.
2. Create a file named `.env` and fill it out with these values:

```env
DISCORD_TOKEN=123
TOP_GG_TOKEN=456
STATCORD_TOKEN=789
HYPIXEL_TOKEN=101112
TESTING_GUILD_ID=131415
```

> Note that every value except for the Top.GG token and testing guild id is required.
> If you don't know where to get the tokens, try to run the bot and it will tell you where to get the missing tokens.

> If you supply a value for `TESTING_GUILD_ID` then slash commands will only be registered to that guild. If you don't provide a value for it, they'll be registered globally.

3. Install dependencies

```bash
# If you don't have pnpm installed...
npm i -g pnpm

# Install dependencies
pnpm i
```

4. Build

```bash
pnpm run build
```

5.  Register slash commands

```bash
pnpm run register
```

6. Run bot

```bash
# With pnpm scripts
pnpm run start

# Or with pm2
pm2 start dist/src/index.js --name "POTATO V3"
```
