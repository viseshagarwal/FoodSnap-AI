import { Workbox, WorkboxLifecycleEvent } from 'workbox-window';

declare global {
  interface Window {
    workbox: Workbox;
  }
}

export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    const wb = new Workbox('/sw.js');
    window.workbox = wb;

    wb.addEventListener('installed', (event: WorkboxLifecycleEvent) => {
      console.log(`Event ${event.type} is triggered.`);
      console.log(event);
    });

    wb.addEventListener('controlling', (event: WorkboxLifecycleEvent) => {
      console.log(`Event ${event.type} is triggered.`);
      console.log(event);
    });

    wb.addEventListener('activated', (event: WorkboxLifecycleEvent) => {
      console.log(`Event ${event.type} is triggered.`);
      console.log(event);
    });

    const promptNewVersionAvailable = (event: WorkboxLifecycleEvent) => {
      if (confirm('A newer version of this web app is available, reload to update?')) {
        wb.addEventListener('controlling', () => {
          window.location.reload();
        });

        wb.messageSkipWaiting();
      } else {
        console.log(
          'User rejected to reload the web app, keep using old version. New version will be automatically load when user open the app next time.'
        );
      }
    };

    wb.addEventListener('waiting', promptNewVersionAvailable);
    wb.register();
  }
} 