import si from "systeminformation";
import * as winInfo from "@arcsine/win-info";
import anitomy, { AnitomyResult } from "anitomy-js";

export default class Shirase {
  /**
   * List of known media player processes
   */
  public MEDIA_PLAYER_PROCESSES: string[] = ["vlc.exe", "mpv.exe", "mpc-hc.exe", "mpc-hc64.exe", "VLC", "mpv"];

  /**
   * Mapping of process names to window titles
   * which can be removed by `prepareWindowTitle`
   */
  public MEDIA_PLAYER_TITLES: Record<string, string> = {
    "vlc.exe": "- VLC media player",
    "mpv.exe": "- mpv"
  };

  /**
   * Method to get anime information from currently running media players
   * 
   * @returns {AnitomyResult[]} array of anitomy result objects
   */
  async getInformation(): Promise<AnitomyResult[]> {
    const processes = await si.processes();

    const mediaProcesses = processes.list.filter(p => {
      return this.MEDIA_PLAYER_PROCESSES.includes(p.name);
    });

    const mediaInformation: AnitomyResult[] = [];

    mediaProcesses.forEach(mProcess => {
      const window = winInfo.getByPidSync(mProcess.pid);
      const title = this.prepareWindowTitle(mProcess.name, window.title);

      mediaInformation.push(anitomy.parseSync(title));
    });

    return mediaInformation;
  }

  /**
   * Helper function to strip player/application suffixes from window titles
   *
   * @param process name of the process
   * @param title window title of the given process
   * @returns {string} title without the window information
   */
  prepareWindowTitle(process: string, title: string): string {
    const titleSuffix = this.MEDIA_PLAYER_TITLES[process];

    if (titleSuffix !== undefined) {
      const titleWithoutPlayerSuffix = title.replace(titleSuffix, "");

      return titleWithoutPlayerSuffix.trim();
    }

    return title;
  }
}