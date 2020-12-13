//formats dates

export const formatDate = (arg: any) => {
    for (let i = 0; i < arg.length; i++) {
        arg[i].timeCreated = new Date(arg[i].timeCreated).toLocaleString();
    }
};

//formats file sizes

export const formatSize = (arg: any) => {
    for (let i = 0; i < arg.length; i++) {
        if (arg[i].size / 1073741824 >= 1) {
            let size = arg[i].size / 1073741824;
            arg[i].size = `${size.toFixed(2)} GB`;
        } else if (arg[i].size / 1048576 >= 1) {
            let size = arg[i].size / 1048576;
            arg[i].size = `${size.toFixed(2)} MB`;
        } else if (arg[i].size / 1024 >= 1) {
            let size = arg[i].size / 1024;
            arg[i].size = `${size.toFixed(2)} KB`;
        } else {
            let size = arg[i].size;
            arg[i].size = `${size} B `;
        }
    }
    /*var newArr = arg.map((x: any) => {
        if (x.size / 1073741824 >= 1) {
            let size = x.size / 1073741824;
            x.size = `${size.toFixed(2)} GB`;
        } else if (x.size / 1048576 >= 1) {
            let size = x.size / 1048576;
            x.size = `${size.toFixed(2)} MB`;
        } else if (x.size / 1024 >= 1) {
            let size = x.size / 1024;
            x.size = `${size.toFixed(2)} KB`;
        } else {
            let size = x.size;
            x.size = `${size} B `;
        }
        console.log("x.size is: ", x.size);
    });*/
};

export const formatData = (arg: any) => {
    formatDate(arg);
    formatSize(arg);
};
