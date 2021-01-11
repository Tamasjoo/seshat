//formats dates

interface IncomingDocu {
    size: number;
    timeCreated: string;
}

interface IncomingDocus extends Array<IncomingDocu> {}

export const formatDate = (timeCreated: string) => {
    //console.log("timeCreated:", timeCreated);
    return new Date(timeCreated).toLocaleString();
};

//formats file sizes

export const formatSize = (size: number) => {
    //console.log("size:", size);
    const KB = 1024;
    const MB = KB ** 2;
    const GB = KB ** 3;

    if (size / GB >= 1) {
        size = size / GB;
        return `${size.toFixed(2)} GB`;
    } else if (size / MB >= 1) {
        size = size / MB;
        return `${size.toFixed(2)} MB`;
    } else if (size / KB >= 1) {
        size = size / KB;
        return `${size.toFixed(2)} KB`;
    } else {
        return `${size} B `;
    }
};

export const formatData = (documents: IncomingDocus) => {
    //console.log("documents:", documents);
    return documents.map((document: any) => {
        document.timeCreated = formatDate(document.timeCreated);
        document.size = formatSize(document.size);
        return document;
    });
};
