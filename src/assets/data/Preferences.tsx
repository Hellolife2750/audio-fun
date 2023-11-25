export interface Preferences {
    autoPlay: boolean,
    autoScroll: boolean,
    blendedPlay: boolean,
}

export const getPreferences = () => {
    let desesialized_preferences = localStorage.getItem("preferences");
    let preferences;

    if (desesialized_preferences) {
        preferences = JSON.parse(desesialized_preferences);
    } else {
        preferences = {
            autoPlay: false,
            autoScroll: true,
            blendedPlay: false,
        }
    }

    return preferences;
}

export const setPreferences = (newPreferencies: any) => {
    let serialized_preferences = JSON.stringify(newPreferencies);
    localStorage.setItem("preferences", serialized_preferences);
}

const clearPreferences = () => {
    localStorage.clear();
}

