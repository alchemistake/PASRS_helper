export const EVENTS = {
    FORMATS_UPDATED: 'pasrs:formats-updated',
    SETTINGS_UPDATED: 'pasrs:settings-updated',
    REPLAYS_UPDATED: 'pasrs:replays-updated'
} as const;

export interface FormatsUpdatedEvent extends CustomEvent {
    detail: {
        formats: string[];
    };
}

export interface SettingsUpdatedEvent extends CustomEvent {
    detail: {
        settings: any;
    };
}

export interface ReplaysUpdatedEvent extends CustomEvent {
    detail: {
        replays: any;
    };
}

// Helper functions for dispatching events
export const dispatchFormatsUpdated = (formats: string[]) => {
    const event = new CustomEvent(EVENTS.FORMATS_UPDATED, {
        detail: { formats }
    });
    window.dispatchEvent(event);
};

export const dispatchSettingsUpdated = (settings: any) => {
    const event = new CustomEvent(EVENTS.SETTINGS_UPDATED, {
        detail: { settings }
    });
    window.dispatchEvent(event);
};

export const dispatchReplaysUpdated = (replays: any) => {
    const event = new CustomEvent(EVENTS.REPLAYS_UPDATED, {
        detail: { replays }
    });
    window.dispatchEvent(event);
}

// Helper functions for listening to events
export const onFormatsUpdated = (callback: (formats: string[]) => void) => {
    const handler = (event: FormatsUpdatedEvent) => {
        callback(event.detail.formats);
    };
    window.addEventListener(EVENTS.FORMATS_UPDATED, handler as EventListener);
    return () => window.removeEventListener(EVENTS.FORMATS_UPDATED, handler as EventListener);
};

export const onSettingsUpdated = (callback: (settings: any) => void) => {
    const handler = (event: SettingsUpdatedEvent) => {
        callback(event.detail.settings);
    };
    window.addEventListener(EVENTS.SETTINGS_UPDATED, handler as EventListener);
    return () => window.removeEventListener(EVENTS.SETTINGS_UPDATED, handler as EventListener);
};

export const onReplaysUpdated = (callback: (replays: any) => void) => {
    const handler = (event: ReplaysUpdatedEvent) => {
        callback(event.detail.replays);
    };
    window.addEventListener(EVENTS.REPLAYS_UPDATED, handler as EventListener);
    return () => window.removeEventListener(EVENTS.REPLAYS_UPDATED, handler as EventListener);
};
