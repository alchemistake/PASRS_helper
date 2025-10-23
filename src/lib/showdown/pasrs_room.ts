import { createHtmlRoom } from "./room";

function createPASRSRoom(): void {
    const room = createHtmlRoom("view-pasrs-helper", "PASRS", {
        side: true,
        icon: "camera",
        focus: true,
    });

    if (room === null) {
        return;
    }

    room.$el.html(`<div id="react-root"></div>`);

    // @ts-ignore : window.PASRS will exist within the actual page
    window.PASRS.startReactRender();
}

export default createPASRSRoom;