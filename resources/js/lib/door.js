/**
 * Tomb-door transition triggers (see Components/TombDoor.jsx, mounted
 * once at the app root so it survives Inertia page swaps).
 *
 * - playDoorOpen(): the doors swing open right now — used on login /
 *   register success; the navigation happens underneath the closed
 *   doors and the new page is revealed as they part.
 * - playDoorClose(then): the doors sweep shut, then `then` runs —
 *   used on logout: armDoorOpenOnArrival() + the actual logout post
 *   go inside `then`, so the doors open again on the page we land on.
 * - The arrival flag lives in sessionStorage so the opening still
 *   plays if the landing is a full page load rather than a visit.
 */
export const DOOR_OPEN_EVENT = 'masr:door-open';
export const DOOR_CLOSE_EVENT = 'masr:door-close';

const ARRIVE_KEY = 'masr-door-open-on-arrival';

export function playDoorOpen() {
    window.dispatchEvent(new CustomEvent(DOOR_OPEN_EVENT));
}

export function playDoorClose(then) {
    window.dispatchEvent(new CustomEvent(DOOR_CLOSE_EVENT, { detail: { then } }));
}

export function armDoorOpenOnArrival() {
    try {
        sessionStorage.setItem(ARRIVE_KEY, '1');
    } catch {
        // sessionStorage unavailable (private mode edge) — the live
        // event path still covers in-app navigation.
    }
}

export function consumeDoorOpenOnArrival() {
    try {
        const armed = sessionStorage.getItem(ARRIVE_KEY) === '1';
        if (armed) {
            sessionStorage.removeItem(ARRIVE_KEY);
        }
        return armed;
    } catch {
        return false;
    }
}
