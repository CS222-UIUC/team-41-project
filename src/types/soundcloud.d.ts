interface SoundCloudWidget {
  Widget: ((element: HTMLIFrameElement) => {
    bind: (event: string, callback: () => void) => void;
    seekTo: (position: number) => void;
    play: () => void;
    pause: () => void;
  }) & {
    Events: {
      READY: string;
    };
  };
}

declare global {
  interface Window {
    SC: SoundCloudWidget;
  }
}

export {};
