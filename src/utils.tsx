//export functions

export { }

export const AudiosCDN: string = "https://hellolife2750.github.io/funny-quotes/Audios-juil-22/";

export const removeAccents = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const formatInput = (content: string) => removeAccents(content.toLowerCase())