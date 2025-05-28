<template>
<!-- Navbar -->
<header class="bg-dark">
<!-- Cover -->
<div class="bg-cover"
    :style="{ 'background-image': StringHelper.isNullOrEmpty(currentUser.userAttributes?.coverImageUrl)
    ? 'url(https://picsum.photos/1600/300)' : `url(${ImageHelper.getCoverImageForUser(currentUser)})` }"></div>
<!-- Info -->
<div class="container-fluid max-w-screen-xl">
    <div class="row g-0">
        <div class="col-auto">
            <a href="#" class="avatar w-40 h-40 border border-body border-4 rounded-circle shadow mt-n16">
                <UserAvatar :user="currentUser"/>
            </a>
        </div>
        <div class="col ps-4 pt-4">
            <!-- Pretitle -->
            <!-- <h6 class="text-xs text-uppercase text-muted mb-1">
            UI Designer
            </h6> -->
            <!-- Title -->
            <h1 class="h2">
            {{ currentUser.name }}
            <span v-if="currentUser.userRole === UserRole.Admin">✨</span>
            <span v-else-if="currentUser.userRole === UserRole.Seller">💸</span>
            <span v-else>💥</span>
            </h1>
            <div class="d-flex gap-2 flex-wrap mt-1">
                <span class="badge rounded-pill j-bg-secondary">{{ userFollowers.length }} followers</span>
            </div>
        </div>
        <div class="col-auto mt-2 mt-md-0 mb-md-3 hstack gap-2 mt-4 mt-sm-0">
            <!-- <button class="btn btn-sm btn-square btn-neutral" disabled>
            <i class="bi bi-envelope"></i>
            </button >
            <a href="#" class="btn btn-sm btn-square btn-neutral">
            <i class="bi bi-bell-fill"></i>
            </a> -->
            <button v-if="!currentLoggedInUser?.id" data-bs-toggle="modal" data-bs-target="#authModal" class="btn btn-sm btn-secondary d-block d-md-inline-block ms-auto ms-md-0">Login Or Sign Up</button>
            <button class="btn btn-sm btn-secondary d-block d-md-inline-block ms-auto ms-md-0" @click="toggleFollow" v-else-if="isCurrentUserFollower">
            UnFollow
            </button>
            <button class="btn btn-sm btn-primary d-block d-md-inline-block ms-auto ms-md-0" @click="toggleFollow" v-else-if="currentUser?.id !== currentLoggedInUser?.id">
            Follow
            </button>
        </div>
    </div>
    <!-- Nav -->
    <ul class="nav nav-pills overflow-x ms-1 mt-6">
        <li class="nav-item">
            <button class="nav-link active font-bold text-white" id="pills-home-tab" data-bs-toggle="pill" data-bs-target="#pills-home" type="button" role="tab" aria-controls="pills-home" aria-selected="true">
            Home <span class="badge rounded-pill bg-opacity-30 bg-info text-info">{{ userPosts.length }}</span>
            </button>
        </li>
        <li class="nav-item">
            <button class="nav-link font-bold text-white" id="pills-nfts-tab" data-bs-toggle="pill" data-bs-target="#pills-nfts" type="button" role="tab" aria-controls="pills-nfts" aria-selected="true">
            Digitals <span class="badge rounded-pill bg-opacity-30 bg-info text-info">{{ userAssets.length }}</span>
            </button>
        </li>
        <li class="nav-item">
            <button class="nav-link font-bold text-white" id="pills-flicks-tab" data-bs-toggle="pill" data-bs-target="#pills-flicks" type="button" role="tab" aria-controls="pills-nfts" aria-selected="true">
            Flicks <span class="badge rounded-pill bg-opacity-30 bg-info text-info">{{ flicks.length }}</span>
            </button>
        </li>        
        <!-- <li class="nav-item">
            <button class="nav-link font-bold text-white" id="pills-sales-tab" data-bs-toggle="pill" data-bs-target="#pills-sales" type="button" role="tab" aria-controls="pills-sales" aria-selected="true">
            Sales/Auctions <span class="badge rounded-pill bg-opacity-30 bg-info text-info">{{ userSales.length + userAuctions.length }}</span>
            </button>
        </li> -->
        <li class="nav-item">
            <button class="nav-link font-bold text-white" id="pills-followers-tab" data-bs-toggle="pill" data-bs-target="#pills-followers" type="button" role="tab" aria-controls="pills-followers" aria-selected="true">
            Followers <span class="badge rounded-pill bg-opacity-30 bg-info text-info">{{ userFollowers.length }}</span>
            </button>
        </li>
        <li class="nav-item">
            <button class="nav-link font-bold text-white" id="pills-following-tab" data-bs-toggle="pill" data-bs-target="#pills-following" type="button" role="tab" aria-controls="pills-following" aria-selected="true">
            Following <span class="badge rounded-pill bg-opacity-30 bg-info text-info">{{ userFollowing.length }}</span>
            </button>
        </li>
        <!-- <li class="nav-item">
            <button disabled class="nav-link font-bold text-tertiary" id="pills-shows-tab" data-bs-toggle="pill" data-bs-target="#pills-shows" type="button" role="tab" aria-controls="pills-shows" aria-selected="true">
            More Options (Coming Soon)
            </button>
        </li>         -->
        <!-- <li class="nav-item">
            <button class="nav-link font-bold text-white" id="pills-about-tab" data-bs-toggle="pill" data-bs-target="#pills-about" type="button" role="tab" aria-controls="pills-about" aria-selected="true">
            About
            </button>
        </li>         -->
    </ul>
</div>
</header>
<!-- Main -->
<main class="py-6 bg-dark  tab-content">
    <div class="container-fluid max-w-screen-xl tab-pane show fade active" id="pills-home" role="tabpanel" aria-labelledby="pills-home-tab">
        <div class="row g-6">
            <div class="col-xl-8">
                <h2>Feed <i class="bi bi-newspaper text-info"></i></h2>
                <SocialPostCard class="mt-4" v-for="(post, index) in userPosts" :key="index" :post="post" @on-comment-saved="getUserPosts" />
            </div>
            <div class="col-xl-4">
                <div class="vstack gap-6">
                <div class="card bg-dark border j-border-primary">
                    <div class="card-body">
                        <h5 class="mb-3 text-white">Bio</h5>
                        <p class="text-sm text-white lh-relaxed mb-4 font-italic" v-if="StringHelper.isNullOrEmpty(currentUser.userAttributes?.bio)">
                            {{ currentUser.name }} prefers an aura of mystery because they haven't added their bio yet
                        </p>
                        <p class="text-sm text-white lh-relaxed mb-4" v-else>
                            {{ currentUser.userAttributes?.bio }}
                        </p>
                        <div class="d-flex align-items-center" v-if="currentUser.userAttributes?.website">
                            <i class="bi bi-globe me-2 text-info"></i>
                            <a :href="currentUser.userAttributes.website" target="_blank" class="text-sm text-info">{{currentUser.userAttributes.website}}</a>
                        </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
    </div>
    <div class="container-fluid max-w-screen-xl tab-pane fade" id="pills-nfts" role="tabpanel" aria-labelledby="pills-nfts-tab">
        <div class="row g-6">
            <div class="col d-flex flex-wrap gap-3 justify-content-center">
                <NFTPublicProfileCard v-for="asset in userAssets" :key="asset.id" :asset="asset" style="width: 250px;"/>
            </div>
        </div>
    </div>
    <div class="container-fluid max-w-screen-xl tab-pane fade" id="pills-flicks" role="tabpanel" aria-labelledby="pills-flicks-tab">
        <div class="row g-6">
            <div class="col-xl-3 col-sm-4 pointer-cursor" v-for="flick in flicks" :key="flick.socialPost.id">
                <FlickCard :video="flick"/>
            </div>
        </div>
    </div>    
    <div class="container-fluid max-w-screen-xl tab-pane fade" id="pills-sales" role="tabpanel" aria-labelledby="pills-sales-tab">
        <div class="row g-6">
            <div class="col d-flex flex-wrap gap-3 justify-content-center">
                <MarketplaceAuctionCard v-for="auction in userAuctions" :key="auction.id" :sale="auction" :sale-assets="auction.saleAssets" style="width: 250px;"/>
            </div>
        </div>
        <div class="row g-6">
            <div class="col d-flex flex-wrap gap-3 justify-content-center">
                <MarketplaceNFTCard v-for="sale in userSales" :key="sale.id" :sale="sale" :sale-assets="sale.saleAssets" style="width: 250px;"/>
            </div>
        </div>
    </div>
    <div class="container-fluid max-w-screen-xl tab-pane fade" id="pills-shows" role="tabpanel" aria-labelledby="pills-shows-tab">
        <div class="row g-6">
        <div class="col-xl-8">
            <div class="vstack gap-6">
            <div class="card">
                <div class="card-body">
                <h5 class="mb-3">Biography</h5>
                <p class="text-sm lh-relaxed mb-4">
                    Personal profiles are the perfect way for you to grab their attention and persuade recruiters to continue reading your CV because you’re telling them from the off exactly why they should hire you. Of course, you’ll need to know
                    how to write an effective statement first, but we’ll get on to that in a bit.
                </p>
                <p class="text-sm lh-loose mb-4">
                    When we strive to become better than we are everything around us becomes better too. This is a wider card with supporting text below. Personal profiles are the perfect way for you to grab their attention and persuade recruiters to continue reading your CV because you’re telling them from the off exactly why they should hire you. Of course, you’ll need to know
                    how to write an effective statement first, but we’ll get on to that in a bit.
                </p>
                <a href="#" class="link-primary font-semibold text-sm">Read more</a>
                </div>
            </div>
            <div class="card">
                <div class="card-body">
                <h5 class="mb-6">Recent Activity</h5>
                <div class="list-group list-group-flush list-group-borderless ms-4">
                    <div class="list-group-item px-2 py-0">
                    <div class="border-start">
                        <div class="d-flex ms-n6 pb-6">
                        <div class="flex-none me-3">
                            <div class="icon icon-shape text-base w-12 h-12 bg-soft-primary text-primary rounded-circle">
                            <i class="bi bi-file-earmark-pdf-fill"></i>
                            </div>
                        </div>
                        <div>
                            <small class="d-block mb-1 text-muted">2 hrs ago</small>
                            <div>You've uploaded <span class="font-bold">documentation.pdf</span> to the <span class="font-bold">Webpixels</span> project</div>
                            <div class="d-flex gap-2 mt-2">
                            <div class="position-relative bg-light border border-dashed border-warning-hover rounded-pill">
                                <div class="py-2 px-3 d-flex align-items-center">
                                <div class="me-2">
                                    <i class="bi bi-image text-warning"></i>
                                </div>
                                <div class="flex-fill">
                                    <a href="#" class="d-block font-semibold text-xs text-muted text-warning-hover stretched-link">documentation.pdf</a>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div class="list-group-item px-2 py-0">
                    <div class="border-start">
                        <div class="d-flex ms-n6 pb-6">
                        <div class="flex-none me-3">
                            <div class="icon icon-shape text-base w-12 h-12 bg-soft-primary text-primary rounded-circle">
                            <i class="bi bi-file-earmark-pdf-fill"></i>
                            </div>
                        </div>
                        <div class="flex-fill">
                            <small class="d-block mb-1 text-muted">4 hrs ago</small>
                            <div class="text-sm">
                            <span class="text-heading text-sm font-bold">Mike</span> added a new comment to your task:
                            </div>
                            <div class="mt-2">
                            <p class="text-sm text-muted">
                                On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee.
                            </p>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div class="list-group-item px-2 py-0">
                    <div class="border-start">
                        <div class="d-flex ms-n6 pb-6">
                        <div class="flex-none me-3">
                            <div class="icon icon-shape text-base w-12 h-12 bg-soft-primary text-primary rounded-circle">
                            <i class="bi bi-file-earmark-pdf-fill"></i>
                            </div>
                        </div>
                        <!-- <div class="flex-fill">
                            <small class="d-block mb-1 text-muted">4 hrs ago</small>
                            <div class="text-sm">
                            Heather added <span class="font-bold">4 images</span> to the <span class="font-bold">Team</span> album:
                            </div>
                            <div class="mt-2 d-flex gap-2 scrollable-x">
                            <div class="col-auto">
                                <img alt="..." src="/img/media/img-3.jpg" class="rounded w-auto h-16">
                            </div>
                            <div class="col-auto">
                                <img alt="..." src="/img/media/img-4.jpg" class="rounded w-auto h-16">
                            </div>
                            <div class="col-auto">
                                <img alt="..." src="/img/media/img-5.jpg" class="rounded w-auto h-16">
                            </div>
                            <div class="col-auto">
                                <img alt="..." src="/img/media/img-6.jpg" class="rounded w-auto h-16">
                            </div>
                            </div>
                        </div> -->
                        </div>
                    </div>
                    </div>
                    <div class="list-group-item px-2 py-0">
                    <div class="border-start">
                        <div class="d-flex ms-n6 pb-6">
                        <div class="flex-none me-3">
                            <div class="icon icon-shape text-base w-12 h-12 bg-soft-primary text-primary rounded-circle">
                            <i class="bi bi-file-earmark-pdf-fill"></i>
                            </div>
                        </div>
                        <div class="flex-fill">
                            <small class="d-block mb-1 text-muted">4 hrs ago</small>
                            <div class="text-sm">
                            Heather added <span class="font-bold">Anna</span> to the <span class="font-bold">Clever</span> team.
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div class="list-group-item px-2 py-0">
                    <div class="border-start">
                        <div class="d-flex ms-n6 pb-6">
                        <div class="flex-none me-3">
                            <div class="icon icon-shape text-base w-12 h-12 bg-soft-primary text-primary rounded-circle">
                            <i class="bi bi-file-earmark-pdf-fill"></i>
                            </div>
                        </div>
                        <div class="flex-fill">
                            <small class="d-block mb-1 text-muted">4 hrs ago</small>
                            <div class="text-sm">
                            Heather created the tags
                            <div class="d-inline-block mx-1">
                                <a href="#" class="badge rounded-pill bg-danger bg-opacity-20 bg-opacity-100-hover text-danger text-white-hover">Bugs</a> <a href="#" class="badge rounded-pill bg-success bg-opacity-20 bg-opacity-100-hover text-success text-white-hover">Showcase</a>
                            </div>
                            for the <span class="font-bold">Clever</span> project
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                    <div class="list-group-item px-2 py-0">
                    <div>
                        <div class="d-flex ms-n6 pb-6">
                        <div class="flex-none me-3">
                            <div class="icon icon-shape text-base w-12 h-12 bg-soft-primary text-primary rounded-circle">
                            <i class="bi bi-file-earmark-pdf-fill"></i>
                            </div>
                        </div>
                        <div class="flex-fill">
                            <small class="d-block mb-1 text-muted">2 hrs ago</small>
                            <div>
                            You've uploaded <span class="font-bold">documentation.pdf</span> to the <span class="font-bold">Webpixels</span> project
                            </div>
                            <div class="mt-2 scrollable-x overflow-hidden">
                            <div class="d-inline-block position-relative bg-light border border-dashed border-tertiary-hover rounded-pill">
                                <div class="py-2 px-3 d-flex align-items-center">
                                <div class="me-2">
                                    <i class="bi bi-image text-tertiary"></i>
                                </div>
                                <div class="flex-fill">
                                    <a href="#" class="d-block font-semibold text-xs text-muted text-tertiary-hover stretched-link">design.fig</a>
                                </div>
                                </div>
                            </div>
                            <div class="d-inline-block position-relative bg-light border border-dashed border-warning-hover rounded-pill">
                                <div class="py-2 px-3 d-flex align-items-center">
                                <div class="me-2">
                                    <i class="bi bi-image text-warning"></i>
                                </div>
                                <div class="flex-fill">
                                    <a href="#" class="d-block font-semibold text-xs text-muted text-warning-hover stretched-link">readme.md</a>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            <div>
                <h5 class="mb-4">My Files</h5>
                <div class="row g-5">
                <div class="col-lg-4 col-sm-6">
                    <div class="card shadow-4-hover">
                    <div class="p-2">
                        <!-- <a href="#" class="d-block">
                        <img class="img-fluid rounded-2" alt="..." src="/img/media/img-800x800-1.jpg" />
                        </a> -->
                    </div>
                    <div class="px-4 pt-2 pb-4">
                        <h6 class="font-semibold mb-2">Website Redesign</h6>
                        <div class="d-flex align-items-center">
                        <div class="text-xs text-muted">
                            <i class="bi bi-lock me-1"></i>Private
                        </div>
                        <div class="text-xs text-muted ms-auto">
                            3 hrs ago
                        </div>
                        </div>
                        <span class="d-block"></span>
                    </div>
                    </div>
                </div>
                <div class="col-lg-4 col-sm-6">
                    <div class="card shadow-4-hover">
                    <div class="p-2">
                        <!-- <a href="#" class="d-block">
                        <img class="img-fluid rounded-2" alt="..." src="/img/media/img-800x800-2.jpg" />
                        </a> -->
                    </div>
                    <div class="px-4 pt-2 pb-4">
                        <h6 class="font-semibold mb-2">Website Redesign</h6>
                        <div class="d-flex align-items-center">
                        <div class="text-xs text-muted">
                            <i class="bi bi-lock me-1"></i>Private
                        </div>
                        <div class="text-xs text-muted ms-auto">
                            3 hrs ago
                        </div>
                        </div>
                        <span class="d-block"></span>
                    </div>
                    </div>
                </div>
                <div class="col-lg-4 col-sm-6">
                    <div class="card shadow-4-hover">
                    <div class="p-2">
                        <!-- <a href="#" class="d-block">
                        <img class="img-fluid rounded-2" alt="..." src="/img/media/img-800x800-3.jpg" />
                        </a> -->
                    </div>
                    <div class="px-4 pt-2 pb-4">
                        <h6 class="font-semibold mb-2">Website Redesign</h6>
                        <div class="d-flex align-items-center">
                        <div class="text-xs text-muted">
                            <i class="bi bi-lock me-1"></i>Private
                        </div>
                        <div class="text-xs text-muted ms-auto">
                            3 hrs ago
                        </div>
                        </div>
                        <span class="d-block"></span>
                    </div>
                    </div>
                </div>
                <div class="col-lg-4 col-sm-6">
                    <div class="card shadow-4-hover">
                    <div class="p-2">
                        <!-- <a href="#" class="d-block">
                        <img class="img-fluid rounded-2" alt="..." src="/img/media/img-800x800-4.jpg" />
                        </a> -->
                    </div>
                    <div class="px-4 pt-2 pb-4">
                        <h6 class="font-semibold mb-2">Website Redesign</h6>
                        <div class="d-flex align-items-center">
                        <div class="text-xs text-muted">
                            <i class="bi bi-lock me-1"></i>Private
                        </div>
                        <div class="text-xs text-muted ms-auto">
                            3 hrs ago
                        </div>
                        </div>
                        <span class="d-block"></span>
                    </div>
                    </div>
                </div>
                <div class="col-lg-4 col-sm-6">
                    <div class="card shadow-4-hover">
                    <div class="p-2">
                        <!-- <a href="#" class="d-block">
                        <img class="img-fluid rounded-2" alt="..." src="/img/media/img-800x800-5.jpg" />
                        </a> -->
                    </div>
                    <div class="px-4 pt-2 pb-4">
                        <h6 class="font-semibold mb-2">Website Redesign</h6>
                        <div class="d-flex align-items-center">
                        <div class="text-xs text-muted">
                            <i class="bi bi-lock me-1"></i>Private
                        </div>
                        <div class="text-xs text-muted ms-auto">
                            3 hrs ago
                        </div>
                        </div>
                        <span class="d-block"></span>
                    </div>
                    </div>
                </div>
                <div class="col-lg-4 col-sm-6">
                    <div class="card shadow-4-hover">
                    <div class="p-2">
                        <!-- <a href="#" class="d-block">
                        <img class="img-fluid rounded-2" alt="..." src="/img/media/img-800x800-6.jpg" />
                        </a> -->
                    </div>
                    <div class="px-4 pt-2 pb-4">
                        <h6 class="font-semibold mb-2">Website Redesign</h6>
                        <div class="d-flex align-items-center">
                        <div class="text-xs text-muted">
                            <i class="bi bi-lock me-1"></i>Private
                        </div>
                        <div class="text-xs text-muted ms-auto">
                            3 hrs ago
                        </div>
                        </div>
                        <span class="d-block"></span>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        <div class="col-xl-4">
            <div class="vstack gap-6">
            <div class="card">
                <div class="card-body">
                <h5 class="mb-4">Location</h5>
                <div class="d-flex align-items-center">
                    <i class="bi bi-geo-alt-fill me-2 text-muted"></i>
                    <a href="#" class="text-sm text-heading text-primary-hover">San Francisco, California</a>
                </div>
                </div>
            </div>
            <div class="card">
                <div class="card-body">
                <h5 class="mb-4">Social</h5>
                <div class="vstack gap-4">
                    <div class="d-flex align-items-center">
                    <i class="bi bi-globe me-2 text-muted"></i>
                    <a href="#" class="text-sm text-heading text-primary-hover">mywebsite.com</a>
                    </div>
                    <div class="d-flex align-items-center">
                    <i class="bi bi-journal-album me-2 text-muted"></i>
                    <a href="#" class="text-sm text-heading text-primary-hover">clever.mywebsite.com</a>
                    </div>
                    <div class="d-flex align-items-center">
                    <i class="bi bi-github me-2 text-muted"></i>
                    <a href="#" class="text-sm text-heading text-primary-hover">GitHub</a>
                    </div>
                    <div class="d-flex align-items-center">
                    <i class="bi bi-dribbble me-2 text-muted"></i>
                    <a href="#" class="text-sm text-heading text-primary-hover">Dribbble</a>
                    </div>
                    <div class="d-flex align-items-center">
                    <i class="bi bi-twitter me-2 text-muted"></i>
                    <a href="#" class="text-sm text-heading text-primary-hover">Twitter</a>
                    </div>
                </div>
                </div>
            </div>
            <div class="card">
                <div class="card-body">
                <h5 class="mb-4">Mutual connections</h5>
                <div class="vstack gap-6">
                    <div class="d-flex align-items-center">
                    <div class="me-3">
                        <!-- <img alt="..." class="avatar rounded-circle" src="/img/people/img-3.jpg" /> -->
                    </div>
                    <div class="flex-1">
                        <a href="#" class="d-block font-semibold text-sm text-heading text-primary-hover">Robert Fox</a>
                        <div class="text-xs text-muted line-clamp-1">
                        Web Developer
                        </div>
                    </div>
                    <div class="ms-auto text-end">
                        <a href="#" class="btn btn-sm px-3 py-1 btn-neutral">Follow</a>
                    </div>
                    </div>
                    <div class="d-flex align-items-center">
                    <div class="me-3">
                        <!-- <img alt="..." class="avatar rounded-circle" src="/img/people/img-1.jpg" /> -->
                    </div>
                    <div class="flex-1">
                        <a href="#" class="d-block font-semibold text-sm text-heading text-primary-hover">Darlene Robertson</a>
                        <div class="text-xs text-muted line-clamp-1">
                        Web Developer
                        </div>
                    </div>
                    <div class="ms-auto text-end">
                        <a href="#" class="btn btn-sm px-3 py-1 btn-neutral">Follow</a>
                    </div>
                    </div>
                    <div class="d-flex align-items-center">
                    <div class="me-3">
                        <!-- <img alt="..." class="avatar rounded-circle" src="/img/people/img-2.jpg" /> -->
                    </div>
                    <div class="flex-1">
                        <a href="#" class="d-block font-semibold text-sm text-heading text-primary-hover">Theresa Webb</a>
                        <div class="text-xs text-muted line-clamp-1">
                        Web Developer
                        </div>
                    </div>
                    <div class="ms-auto text-end">
                        <a href="#" class="btn btn-sm px-3 py-1 btn-neutral">Follow</a>
                    </div>
                    </div>
                    <div class="d-flex align-items-center">
                    <div class="me-3">
                        <!-- <img alt="..." class="avatar rounded-circle" src="/img/people/img-3.jpg" /> -->
                    </div>
                    <div class="flex-1">
                        <a href="#" class="d-block font-semibold text-sm text-heading text-primary-hover">Kristin Watson</a>
                        <div class="text-xs text-muted line-clamp-1">
                        Web Developer
                        </div>
                    </div>
                    <div class="ms-auto text-end">
                        <a href="#" class="btn btn-sm px-3 py-1 btn-neutral">Follow</a>
                    </div>
                    </div>
                    <div class="d-flex align-items-center">
                    <div class="me-3">
                        <!-- <img alt="..." class="avatar rounded-circle" src="/img/people/img-4.jpg" /> -->
                    </div>
                    <div class="flex-1">
                        <a href="#" class="d-block font-semibold text-sm text-heading text-primary-hover">Cody Fisher</a>
                        <div class="text-xs text-muted line-clamp-1">
                        Web Developer
                        </div>
                    </div>
                    <div class="ms-auto text-end">
                        <a href="#" class="btn btn-sm px-3 py-1 btn-neutral">Follow</a>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
    <div class="container-fluid max-w-screen-xl tab-pane fade" id="pills-followers" role="tabpanel" aria-labelledby="pills-followers-tab">
        <div class="row g-6">
        <div class="col-xl-8">
            <div class="vstack gap-6">
                <div class="card bg-dark border j-border-primary">
                <div class="card-body">
                <h5 class="mb-4">Followers</h5>
                <div class="vstack gap-6">
                    <div class="d-flex align-items-center" v-for="user in userFollowers" :key="user.id">
                    <div class="me-3">
                        <UserAvatar :user="user" />
                    </div>
                    <div class="flex-1">
                        <a :href="`/profile/${user.id}`" class="d-block font-semibold text-sm text-white">{{ user.name }}</a>
                    </div>
                    <div class="ms-auto text-end">
                        <a :href="`/profile/${user.id}`" class="btn btn-sm px-3 py-1 btn-neutral">View Profile</a>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        <div class="col-xl-4">
            <div class="vstack gap-6">

            </div>
        </div>
        </div>
    </div>
    <div class="container-fluid max-w-screen-xl tab-pane fade" id="pills-following" role="tabpanel" aria-labelledby="pills-following-tab">
        <div class="row g-6">
        <div class="col-xl-8">
            <div class="vstack gap-6">
                <div class="card bg-dark border j-border-primary">
                <div class="card-body">
                <h5 class="mb-4">Following</h5>
                <div class="vstack gap-6">
                    <div class="d-flex align-items-center" v-for="user in userFollowing" :key="user.id">
                    <div class="me-3">
                        <UserAvatar :user="user" />
                    </div>
                    <div class="flex-1">
                        <a :href="`/profile/${user.id}`" class="d-block font-semibold text-sm text-white">{{ user.name }}</a>
                    </div>
                    <div class="ms-auto text-end">
                        <a :href="`/profile/${user.id}`" class="btn btn-sm px-3 py-1 btn-neutral">View Profile</a>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
        <div class="col-xl-4">
            <div class="vstack gap-6">

            </div>
        </div>
        </div>
    </div>
</main>
</template>

<script lang="ts" setup>import ErrorLogger from '@/helpers/ErrorLogger';
import LoadingHelper from '@/helpers/LoadingHelper';
import ToastHelper from '@/helpers/ToastHelper';
import { SocialPostViewModel, TransferStatus, WalletAsset, UserRole, User, MarketplaceSale, SocialPostType } from '@/services/api/models';
import SaleService from '@/services/domain/SaleService';
import { RestApi } from '@/services/RestApi';
import { onMounted, ref } from 'vue';
import NFTPublicProfileCard from '@/components/NFT/NFTPublicProfileCard.vue';
import SocialPostCard from '@/components/social/SocialPostCard.vue';
import UserAvatar from '@/components/social/UserAvatar.vue';
import StringHelper from '@/helpers/StringHelper';
import { useRoute } from 'vue-router';
import { computed } from '@vue/reactivity';
import { useStore } from '@/store/main.store';
import ImageHelper from '@/helpers/ImageHelper';
import MarketplaceNFTCard from '@/components/marketplace/MarketplaceNFTCard.vue';
import MarketplaceAuctionCard from '@/components/marketplace/MarketplaceAuctionCard.vue';
import FlickCard from '@/components/social/FlickCard.vue';

const route = useRoute()
const store = useStore();

const currentUserId = route.params.id as string;

const currentUser = ref({ userAttributes: {} } as User);

const currentLoggedInUser = computed(() => currentUser.value)

async function getCurrentUser() {
    try {
        currentUser.value = (await RestApi.User.getByName(currentUserId)).data;

        if (!currentUser.value) {
            ToastHelper.error('The user was not found')
        }
    } catch (err) {
        ToastHelper.error('There was an error retrieving the user')
    }    
}

const userAssets = ref([] as WalletAsset[]);

function showAsset(asset: WalletAsset) {
    return asset.transferStatus === TransferStatus.TransferAvailable
        || asset.transferStatus === TransferStatus.ListedForSale
}

async function getUserAssets () {
    const loader = LoadingHelper.showLoader();

    try {
        userAssets.value = (await RestApi.Asset.getByUserId(currentUser.value.id)).data ?? [];
        userAssets.value = userAssets.value.filter(w => showAsset(w));
    } catch (err) {
        ToastHelper.error('There was an error retrieving the NFTs. Please try again later.')
        await ErrorLogger.logApiError(err)
    }

    LoadingHelper.hideLoader(loader);
}

const userPosts = ref([] as SocialPostViewModel[])

async function getUserPosts() {
    userPosts.value = (await RestApi.Social.getByUserId(currentUser.value.id, SocialPostType.Post)).data;
}

const userFollowers = ref([] as User[])

async function getUserFollowers() {
    userFollowers.value = (await RestApi.Social.getUserFollowers(currentUser.value.id)).data;
}

const userFollowing = ref([] as User[])

async function getUserFollowing() {
    userFollowing.value = (await RestApi.Social.getUserFollowing(currentUser.value.id)).data;
}

const isCurrentUserFollower = ref(false);

async function getCurrentUserFollowerStatus() {
    isCurrentUserFollower.value = (await RestApi.Social.doesUserFollow(currentUser.value.id)).data;
}

async function toggleFollow() {
    const loader = LoadingHelper.showLoader();

    try {
        await RestApi.Social.toggleFollow(currentUser.value.id);
        await getCurrentUserFollowerStatus();
        await getUserFollowers();
    } catch (err) {
        ToastHelper.error('There was an error following the user. Please try again.')
        await ErrorLogger.logApiError(err)
    }

    LoadingHelper.hideLoader(loader);
}

const userSales = ref([] as MarketplaceSale[])
const userAuctions = ref([] as MarketplaceSale[])

async function getUserSales() {
    userSales.value = (await RestApi.Marketplace.getSalesBySellerId(currentUser.value.id)).data;
    userAuctions.value = (await RestApi.Marketplace.getAuctionsBySellerId(currentUser.value.id)).data;
}

const flicks = ref([] as SocialPostViewModel[])

async function getUserVideos() {
  try {
    flicks.value = (await RestApi.Social.getByUserId(currentUser.value.id, SocialPostType.Flick)).data;
  } catch (err) {
    ToastHelper.error('There was an error retreiving flicks. Please try again.')
  }
}

onMounted(async () => {
    await getCurrentUser();
    await getUserPosts()
    await getUserAssets();
    await getCurrentUserFollowerStatus();
    await getUserFollowers();
    await getUserFollowing();
    await getUserSales();
    await getUserVideos();
})

</script>

<style scoped>
.nav-link.active {
    background-color: var(--primary-color) !important;
    border-color: var(--primary-color) !important;
    color: #fff !important;
}

.bg-cover {
    height: 300px;

    background-position: center center;
}
</style>