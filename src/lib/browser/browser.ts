export async function copyToClipboard(text: string, showNotification: boolean = false): Promise<boolean> {
    try {
        if (!navigator.clipboard) {
            console.warn('Clipboard API not available');
            return false;
        }

        // Check for clipboard-write permission
        const permission = await navigator.permissions.query({ name: 'clipboard-write' as PermissionName });
        
        if (permission.state === 'denied') {
            console.warn('Clipboard permission denied');
            return false;
        }

        // If permission is prompt, the writeText call will trigger the permission request
        await navigator.clipboard.writeText(text);
        
        if (showNotification) {
            new Notification("Your replay has been uploaded!");
        }
        
        return true;
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        return false;
    }
}

export async function copyToClipboardWithRetry(
    text: string, 
    showNotification: boolean = false, 
    maxRetries: number = 10, 
    retryDelay: number = 250
): Promise<boolean> {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        const success = await copyToClipboard(text, showNotification);
        
        if (success) {
            return true;
        }
        
        if (attempt < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, retryDelay));
        }
    }
    
    console.error(`Failed to copy to clipboard after ${maxRetries + 1} attempts`);
    return false;
}