/**
  * Image constants.
  */
export const IMAGE_STAR = '../images/badges/star.png';
export const IMAGE_STAR_AWAKENED = '../images/badges/star-awakened.png';

export const IMAGE_BADGE_ARENA = '../images/badges/arena.png';
export const IMAGE_BADGE_QUEST = '../images/badges/quest.png';
export const IMAGE_BADGE_ALLIANCE_QUEST = '../images/badges/alliance-quest.png';
export const IMAGE_BADGE_ALLIANCE_WAR = '../images/badges/alliance-war.png';

export const IMAGE_BADGE_RANK_UP = '../images/badges/rank-up.png';
export const IMAGE_BADGE_LEVEL_MAX = '../images/badges/max.png';

export const IMAGE_CURRENCY_GOLD = '../images/currency/gold.png';

export const IMAGE_EMPTY = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

/**
  * Get the cached image or fetch. Preload constant images.
  */
const images = {};

//Require needs to be used with constants. Variables doesn't work as they can't be resolved.
[ require.context('../images/badges', true, /\.png$/),
    require.context('../images/borders', true, /\.png$/),
    require.context('../images/currency', true, /\.png$/),
    require.context('../images/currency', true, /\.png$/),
    require.context('../images/catalysts', true, /\.png$/) ]
    .forEach((requiredImages) => preloadImagesFrom(requiredImages));

function preloadImagesFrom(requiredImages) {
    requiredImages.keys().forEach((key) => {
        const image = new Image();
        image.src = requiredImages(key).default;
        image.loaded = true;
        const imageName = requiredImages.resolve(key).replace(/.*\/images/, '../images');
        images[ imageName ] = image;
    });
}

function removeListeners(image) {
    image.onload = null;
    image.onerror = null;
}

function imageLoaded(resolve) {
    return (event) => {
        event.srcElement.loaded = true;
        resolve(event.srcElement);
        removeListeners(event.srcElement);
    };
}

function imageLoadFailed(image, reject) {
    return (errorMessage) => {
        image.src = null;
        reject(errorMessage);
        removeListeners(event.srcElement);
    };
}

function getImagePromise(src) {
    return new Promise((resolve, reject) => {
        let image = images[ src ];
        if(!image) {
            image = new Image();
            image.src = `${ src }`;
            images[ src ] = image;
            image.loaded = null;
            image.onload = imageLoaded(resolve);
            image.onerror = imageLoadFailed(image, reject);
        }
        else {
            resolve(image);
        }
    });
}

export function loadImages(vnode, ...imagesToLoad) {
    if (!vnode.state.images) {
        vnode.state.images = {};
    }
    //This way components can prevent redraw until all images are loaded
    vnode.state.loadingImages = true;
    const imagePromises = imagesToLoad.map((imageSrc) => {
        const cachedImage = images[ imageSrc ];
        if (cachedImage) {
            vnode.state.images[ imageSrc ] = cachedImage;
            return Promise.resolve();
        }
        //Dummy image until loaded
        const dummyImage = new Image();
        vnode.state.images[ imageSrc ] = dummyImage;
        dummyImage.src = imageSrc;
        dummyImage.loaded = true;
        return getImagePromise(imageSrc, vnode).then((image) => {
            vnode.state.images[ imageSrc ] = image;
            //Returning image to trigger a redraw
            return image;
        });
    });
    return Promise.allSettled(imagePromises).then((finishedPromises) => {
        //Letting the components know that image loading is finished
        vnode.state.loadingImages = false;
        const needRedraw = finishedPromises.find((promiseResult) => promiseResult.value) !== undefined;
        //If all images were already loaded we don't need to redraw
        if (needRedraw) {
            m.redraw();
        }
    });
}

export function getCatalystImage(catalystImageName) {
    return images[ `../images/catalysts/${ catalystImageName }.png` ].src;
}
