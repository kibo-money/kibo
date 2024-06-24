import { useRegisterSW } from "virtual:pwa-register/solid";

export function Update() {
  // if ("serviceWorker" in navigator) {
  //   navigator.serviceWorker.getRegistrations().then((l) => {
  //     console.log(l);
  //     if (!l.length) return;

  //     wasAlreadySW.set(true);

  //     // navigator.serviceWorker.addEventListener("controllerchange", () => {
  //     //   // Will show up in safari and chrome
  //     //   console.log("sw: controller change");

  //     //   setTimeout(() => {
  //     //     needsRefresh.set(true);
  //     //   }, 1000);
  //     // });
  //   });

  //   setTimeout(() => {
  //     navigator.serviceWorker
  //       .register("/sw.js", { scope: "/" })
  //       .then((registration) => {
  //         // Will show up on safari sw update but not on chrome
  //         console.log("sw: registration succeeded");

  //         console.log(registration);

  //         registration.addEventListener("updatefound", () => {
  //           if (wasAlreadySW()) {
  //             setTimeout(() => {
  //               needsRefresh.set(true);
  //             }, 1000);
  //           }
  //           // will show up on chrome sw update
  //           console.log("sw: update found");
  //         });
  //       })
  //       .catch((error) => {
  //         // registration failed
  //         console.error(`sw: registration failed with ${error}`);
  //       });
  //   }, 5000);
  // }

  // useRegisterSW can also return an offlineReady thingy
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    immediate: true,
    onRegisteredSW(swUrl, r) {
      console.log("sw: registered: " + r?.scope);
    },
    onRegisterError(error: Error) {
      console.log("sw: registration error", error);
    },
  });

  return (
    <Show when={needRefresh()}>
      <div class="absolute inset-x-1.5 top-1.5 z-[99999] flex items-center justify-between rounded-lg bg-orange-700/75 p-1.5 shadow backdrop-blur-sm">
        <div>
          <span class="truncate px-1">New version available, please</span>
          <button
            class="mr-2 rounded-md bg-orange-50 bg-opacity-60 px-1.5 py-0.5 font-medium text-orange-950 hover:bg-opacity-100"
            onClick={async () => await updateServiceWorker()}
          >
            install
          </button>
        </div>
        <button
          class="rounded-md bg-black/25 p-1 hover:bg-black/50"
          onClick={() => setNeedRefresh(false)}
        >
          <IconTablerX />
        </button>
      </div>
    </Show>
  );
}
