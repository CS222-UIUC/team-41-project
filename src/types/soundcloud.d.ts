interface SoundCloudWidget {
  Widget: ((element: HTMLIFrameElement) => {
    bind: (event: string, callback: () => void) => void;
    unbind: (event: string) => void;
    seekTo: (position: number) => void;
    play: () => void;
    pause: () => void;
    getCurrentSound: (callback: (sound: { duration: number }) => void) => void;
  }) & {
    Events: {
      READY: string;
      PLAY: string;
      PAUSE: string;
      FINISH: string;
    };
  };
}

declare global {
  interface Window {
    SC: SoundCloudWidget;
  }
}

export {};
