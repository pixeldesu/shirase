const si = require("systeminformation");
const winInfo = require("@arcsine/win-info");
const _ = require("lodash");
const anitomy = require("anitomy-js");

module.exports = class Shirase {
  static MEDIA_PLAYER_PROCESSES() {
    return ["vlc.exe", "mpv.exe", "mpc-hc.exe", "mpc-hc64.exe"];
  }

  static MEDIA_PLAYER_TITLES() {
    return {
      "vlc.exe": "- VLC media player",
      "mpv.exe": "- mpv"
    };
  }

  getInformation() {
    let self = this;

    return new Promise((resolve, reject) => {
      si.processes()
        .then(processes => {
          let mediaProcesses = _.filter(processes.list, p => {
            return Shirase.MEDIA_PLAYER_PROCESSES().includes(p.name);
          });

          let mediaInformation = [];

          mediaProcesses.forEach(mProcess => {
            let window = winInfo.getByPidSync(mProcess.pid);
            let title = self.prepareWindowTitle(mProcess.name, window.title);

            mediaInformation.push(anitomy.parseSync(title));
          });

          resolve(mediaInformation);
        })
        .catch(error => reject(error));
    });
  }

  prepareWindowTitle(process, title) {
    let titleSuffix = Shirase.MEDIA_PLAYER_TITLES()[process];
    if (titleSuffix !== undefined) {
      let titleWithoutPlayerSuffix = title.replace(titleSuffix, "");

      return titleWithoutPlayerSuffix.trim();
    }

    return title;
  }
};
