# shirase

Shirase is a library that enables developers to get information of anime currently being played in media players.

## Installation

You can get shirase over npm

```
npm install shirase
```

## Usage

Using shirase is really easy!

```js
import Shirase from 'shirase';
const shi = new Shirase();

(async () => {
  const information = await shi.getInformation();
  console.log(information);
});
```

`information` (or however you name the Promise return value) is an object containing various fields of information coming from [anitomy](https://github.com/skiptirengu/anitomy-js).

## How does it work?

There are a lot of programs using a multitude of batch/shell/PowerShell scripts to get currently running anime, I wondered about there being a way to grab all of that information just inside NodeJS.

Shirase will query for all running processes, then check for a whitelist of media player process names (found in `Shirase.MEDIA_PLAYER_PROCESSES`) and filter these out.

Out of the narrowed list of processes, Shirase will use the PID to query the system for window information of that specific process.

This information includes the title, which we will prepare beforehand, consisting of removing eventual title suffixes (e.g. VLCs `- VLC media player`) and trimming it down.

Once that is done, the title will be passed to [anitomy](https://github.com/skiptirengu/anitomy-js), which parses the title into an object with various different fields from information given. After all players have been checked through, an array with all found information sets will be returned in the Promise.

## Contributing

### Feature Request / Player Support

If you run `shirase` locally, in a development setup and find that there's a player that hasn't been added to the internal list of supported ones yet, feel free to [open an issue](https://github.com/pixeldesu/shirase/issues/new) or a [pull request](https://github.com/pixeldesu/shirase/compare)!

## License

Shirase is licensed under the MIT License.
