


// Custom viewports matching BackstopJS common configurations
export const customViewports = {
    // BackstopJS Desktop viewports
    desktop: {
        name: 'Desktop (1920x1080)',
        styles: {
            width: '1920px',
            height: '1080px',
        },
        type: 'desktop',
    },
    desktopLarge: {
        name: 'Desktop Large (1440x900)',
        styles: {
            width: '1440px',
            height: '900px',
        },
        type: 'desktop',
    },
    laptop: {
        name: 'Laptop (1024x768)',
        styles: {
            width: '1024px',
            height: '768px',
        },
        type: 'desktop',
    },
    // BackstopJS Tablet viewports
    tabletLandscape: {
        name: 'Tablet Landscape (1024x768)',
        styles: {
            width: '1024px',
            height: '768px',
        },
        type: 'tablet',
    },
    tabletPortrait: {
        name: 'Tablet Portrait (768x1024)',
        styles: {
            width: '768px',
            height: '1024px',
        },
        type: 'tablet',
    },
    // BackstopJS Mobile viewports
    mobileLarge: {
        name: 'Mobile Large (414x896)',
        styles: {
            width: '414px',
            height: '896px',
        },
        type: 'mobile',
    },
    mobileStandard: {
        name: 'Mobile Standard (393x852)',
        styles: {
            width: '393px',
            height: '852px',
            deviceScaleFactor: 3,
        },
        type: 'mobile',
    },
    mobile: {
        name: 'Mobile (375x667)',
        styles: {
            width: '375px',
            height: '667px',
        },
        type: 'mobile',
    },
    mobileSmall: {
        name: 'Mobile Small (320x568)',
        styles: {
            width: '320px',
            height: '568px',
        },
        type: 'mobile',
    },
};


export const mobileSmallParams = {
    parameters: {
        layout: 'fullscreen',
        viewport: {
            defaultViewport: 'mobileSmall',
        },
    }

}


export const mobileStandard = {
    parameters: {
        layout: 'fullscreen',
        viewport: {
            defaultViewport: 'mobileStandard',
        },
    }

}
export const mobileLargeParams = {
    parameters: {
        layout: 'fullscreen',
        viewport: {
            defaultViewport: 'mobileLarge',
        },
    }

}

export const mobileParams = mobileStandard
