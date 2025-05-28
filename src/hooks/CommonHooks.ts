export function removeSideNavigation(routeName: string) {
    const navExcludedPages = [
        'Login',
        'Register',
        // 'PresentLivestream',
        // 'AttendLivestream',
        'AttendLivestreamV2',
        'AirDropFestPromo',
        'AppWaitlist'
    ];

    return navExcludedPages.includes(routeName);
}

export function removeTopNavigation(routeName: string) {
    const navExcludedPages = [
        'Login',
        'Register',
        'AttendLivestreamV2'
    ];

    return navExcludedPages.includes(routeName);
}

export function showTopNavLogo(routeName: string) {
    const navExcludedPages = [
        // 'PresentLivestream',
        // 'AttendLivestream',
        'AirDropFestPromo',
        'AppWaitlist'
    ];

    return navExcludedPages.includes(routeName);
}

export function showAltNav(routeName: string) {
    const pages = [
        'AirDropFestPromo',
        'AppWaitlist'
    ];

    return pages.includes(routeName);
}