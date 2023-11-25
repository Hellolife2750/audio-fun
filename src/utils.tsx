//export functions

export const AUDIO_EXTENSION: string = ".ogg";

export const AudiosCDN: string = "https://hellolife2750.github.io/funny-quotes/Audios-juil-22/";

export const removeAccents = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const formatInput = (content: string) => removeAccents(content.toLowerCase());

export const randomIntBetween = (min: number, max: number) => { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

export const getFileNameFromUrl = (fileUrl: string): string => {
    console.log(fileUrl)
    return fileUrl.substring(fileUrl.lastIndexOf('/') + 1, fileUrl.lastIndexOf('.')).replace(/%20/g, ' ');
}

export const downloadFile = (fileUrl: string) => {
    fetch(fileUrl)
        .then(r => r.blob())
        .then(blob => {
            const urlBlob = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = urlBlob;
            a.download = getFileNameFromUrl(fileUrl);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        })
        .catch(error => console.error('Erreur lors du téléchargement du fichier :', error));
}

