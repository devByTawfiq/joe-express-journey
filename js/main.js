/*
 * Main JS file for JE TechHub website
 */

(function($) {
    "use strict";
    
    /*==================================
    // Button Click Enhancement
    ==================================*/ 
    // Make all button links clickable and proper navigation
    $(document).ready(function() {
        // Handle all button links
        $('.btn').on('click', function(e) {
            const href = $(this).attr('href');
            
            // If the button has an href attribute and it's not just '#'
            if (href && href !== '#') {
                window.location.href = href;
            }
        });
        
        // Make card buttons clickable
        $('.card-button').on('click', function(e) {
            const href = $(this).attr('href');
            
            // If the button has an href attribute and it's not just '#'
            if (href && href !== '#') {
                window.location.href = href;
            }
        });
        
        // Make action buttons clickable
        $('.action-btn').on('click', function(e) {
            const href = $(this).attr('href');
            
            // If the button has an href attribute and it's not just '#'
            if (href && href !== '#') {
                window.location.href = href;
            }
        });
    });
    
    /*=======================================
    [Start Activation Code]
    ==========================================
    * Sticky Header JS
    * Search JS
    * Mobile Menu JS
    * Hero Slider JS
    * Testimonial Slider JS
    * Portfolio Slider JS
    * Clients Slider JS
    * Single Portfolio Slider JS
    * Accordion JS
    * Nice Select JS
    * Date Picker JS
    * Counter Up JS
    * Checkbox JS
    * Right Bar JS
    * Video Popup JS
    * Wow JS
    * Scroll Up JS
    * Animate Scroll JS
    * Stellar JS
    * Google Maps JS
    * Preloader JS
    ==========================================
    [End Activation Code]
    ==========================================*/ 
    $(document).on('ready', function() {
    
        jQuery(window).on('scroll', function() {
            if ($(this).scrollTop() > 200) {
                $('#header .header-inner').addClass("sticky");
            } else {
                $('#header .header-inner').removeClass("sticky");
            }
        });
        
        /*====================================
            Sticky Header JS
        =======================================*/ 
        jQuery(window).on('scroll', function() {
            if ($(this).scrollTop() > 100) {
                $('.header').addClass("sticky");
            } else {
                $('.header').removeClass("sticky");
            }
        });
        
        $('.pro-features .get-pro').on( "click", function(){
            $('.pro-features').toggleClass('active');
        });
        
        /*====================================
            Search JS
        =======================================*/ 
        $('.search a').on( "click", function(){
            $('.search-top').toggleClass('active');
        });
        
        /*====================================
            Mobile Menu
        =======================================*/ 	
        $('.menu').slicknav({
            prependTo:".mobile-nav",
            duration: 300,
            closeOnClick:true,
        });
        
        /*===============================
            Hero Slider JS
        ==================================*/ 
        $(".hero-slider").owlCarousel({
            loop:true,
            autoplay:true,
            smartSpeed: 900,
            autoplayTimeout:9500,
            singleItem: true,
            autoplayHoverPause:true,
            items:1,
            nav:true,
            navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>', '<i class="fa fa-angle-right" aria-hidden="true"></i>'],
            dots:false,
        });

        /*===============================
            Testimonial Slider JS
        ==================================*/ 
        $('.testimonial-slider').owlCarousel({
            items:3,
            autoplay:true,
            autoplayTimeout:4500,
            smartSpeed:300,
            autoplayHoverPause:true,
            loop:true,
            merge:true,
            nav:false,
            dots:true,
            responsive:{
                1: {
                    items:1,
                },
                300: {
                    items:1,
                },
                480: {
                    items:1,
                },
                768: {
                    items:2,
                },
                1170: {
                    items:3,
                },
            }
        });
        
        /*===============================
            Portfolio Slider JS
        ==================================*/ 
        $('.portfolio-slider').owlCarousel({
            autoplay:true,
            autoplayTimeout:4000,
            margin:15,
            smartSpeed:300,
            autoplayHoverPause:true,
            loop:true,
            nav:true,
            dots:false,
            responsive:{
                300: {
                    items:1,
                },
                480: {
                    items:2,
                },
                768: {
                    items:2,
                },
                1170: {
                    items:4,
                },
            }
        });
        
        /*=====================================
            Counter Up JS
        =======================================*/
        $('.counter').counterUp({
            delay:20,
            time:2000
        });
        
        /*===============================
            Clients Slider JS
        ==================================*/ 
        $('.clients-slider').owlCarousel({
            items:5,
            autoplay:true,
            autoplayTimeout:3500,
            margin:15,
            smartSpeed: 400,
            autoplayHoverPause:true,
            loop:true,
            nav:false,
            dots:false,
            responsive:{
                300: {
                    items:1,
                },
                480: {
                    items:2,
                },
                768: {
                    items:3,
                },
                1170: {
                    items:5,
                },
            }
        });
        
        /*====================================
            Single Portfolio Slider JS
        =======================================*/ 
        $('.pf-details-slider').owlCarousel({
            items:1,
            autoplay:false,
            autoplayTimeout:5000,
            smartSpeed: 400,
            autoplayHoverPause:true,
            loop:true,
            merge:true,
            nav:true,
            dots:false,
            navText: ['<i class="icofont-rounded-left"></i>', '<i class="icofont-rounded-right"></i>'],
        });
        
        /*===================
            Accordion JS
        ======================*/ 
        $('.accordion > li:eq(0) a').addClass('active').next().slideDown();
        $('.accordion a').on('click', function(j) {
            var dropDown = $(this).closest('li').find('p');
            $(this).closest('.accordion').find('p').not(dropDown).slideUp(300);
            if ($(this).hasClass('active')) {
                $(this).removeClass('active');
            } else {
                $(this).closest('.accordion').find('a.active').removeClass('active');
                $(this).addClass('active');
            }
            dropDown.stop(false, true).slideToggle(300);
            j.preventDefault();
        });
        
        /*====================================
            Nice Select JS
        =======================================*/ 	
        $('select').niceSelect();
        
        /*=====================================
            Date Picker JS
        =======================================*/ 
        $( function() {
            $( "#datepicker" ).datepicker();
        } );
        
        
        /*===============================
            Checkbox JS
        ==================================*/  
        $('input[type="checkbox"]').change(function(){
            if($(this).is(':checked')){
                $(this).parent("label").addClass("checked");
            } else {
                $(this).parent("label").removeClass("checked");
            }
        });
        
        /*===============================
            Right Bar JS
        ==================================*/ 
        $('.right-bar .bar').on( "click", function(){
            $('.sidebar-menu').addClass('active');
        });
        $('.sidebar-menu .cross').on( "click", function(){
            $('.sidebar-menu').removeClass('active');
        });
        
        /*=====================
            Video Popup JS
        ========================*/ 
        $('.video-popup').magnificPopup({
            type: 'video',	
        });
        
        /*================
            Wow JS
        ===================*/		
        var window_width = $(window).width();   
            if(window_width > 767){
            new WOW().init();
        }

        /*===================
            Scroll Up JS
        ======================*/
        $.scrollUp({
            scrollText: '<span><i class="fa fa-angle-up"></i></span>',
            easingType: 'easeInOutExpo',
            scrollSpeed: 900,
            animation: 'fade'
        }); 

        /*=======================
            Animate Scroll JS
        ==========================*/
        $('.scroll').on("click", function (e) {
            e.preventDefault();
            
            // Get the target element
            const targetHref = $(this).attr('href');
            
            // Handle external links
            if (!targetHref.includes('#') || targetHref === '#') {
                window.location.href = targetHref;
                return;
            }
            
            let targetId;
            // Check if the href contains a hash and is pointing to another page
            if (targetHref.includes('#') && targetHref.split('#')[0] !== '') {
                // This is a link to another page with a hash
                const pageName = targetHref.split('#')[0];
                const currentPage = window.location.pathname.split('/').pop();
                
                // If we're not on the target page, navigate there
                if (!currentPage.includes(pageName)) {
                    window.location.href = targetHref;
                    return;
                }
                
                // Extract the hash part for scrolling on this page
                targetId = targetHref.split('#')[1];
            } else {
                // Just a hash link on the current page
                targetId = targetHref.replace('#', '');
            }
            
            const $target = $('#' + targetId);
            
            // Only scroll if the target element exists
            if ($target.length) {
                const headerHeight = $('.header').outerHeight() || 0;
                
                $('html, body').stop().animate({
                    scrollTop: $target.offset().top - headerHeight - 20
                }, 1000, 'easeInOutExpo');
                
                // Update active class
                $('.nav.menu li a').removeClass('active');
                $(this).addClass('active');
            }
        });

        // Active link highlighting when scrolling
        $(window).on('scroll', function() {
            const scrollPos = $(window).scrollTop();
            const headerHeight = $('.header').outerHeight() || 0;
            
            // Check each section's position and update active class accordingly
            $('section[id], div[id="services"], div[id="about"]').each(function() {
                const sectionTop = $(this).offset().top - headerHeight - 100;
                const sectionBottom = sectionTop + $(this).outerHeight();
                const sectionId = $(this).attr('id');
                
                if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                    $('.nav.menu li a').removeClass('active');
                    
                    // Find any nav link that points to this section
                    $('.nav.menu li a').each(function() {
                        const href = $(this).attr('href');
                        if (href && (href === '#' + sectionId || href.endsWith('#' + sectionId))) {
                            $(this).addClass('active');
                        }
                    });
                }
            });
        });
        
        /*=======================
            Stellar JS
        ==========================*/
        $.stellar({
          horizontalOffset: 0,
          verticalOffset: 0
        });

        /*====================
            Google Maps JS
        =======================*/
        var map = new GMaps({
                el: '#map',
                lat: 23.011245,
                lng: 90.884780,
                scrollwheel: false,
            });
            map.addMarker({
                lat: 23.011245,
                lng: 90.884780,
                title: 'Marker with InfoWindow',
                infoWindow: {
                content: '<p>welcome to Medipro</p>'
            }
        
        });
    });
    
    /*====================
        Preloader JS
    =======================*/
    $(window).on('load', function() {
        $('.preloader').addClass('preloader-deactivate');
        
        // Add delay to hide the loader wrapper
        setTimeout(function() {
            $('.loader-wrapper').addClass('hidden');
        }, 1000);
        
        // Initialize active menu link based on URL
        initActiveMenuLink();
    });
    
    // Function to initialize active menu link based on current URL
    function initActiveMenuLink() {
        const currentUrl = window.location.pathname;
        const currentHash = window.location.hash;
        
        $('.nav.menu li a').each(function() {
            const linkHref = $(this).attr('href');
            
            // Check if this is the current page
            if (currentUrl.endsWith(linkHref) || 
                (currentHash && linkHref && linkHref.endsWith(currentHash))) {
                $('.nav.menu li').removeClass('active');
                $(this).parent('li').addClass('active');
                $(this).addClass('active');
            }
        });
    }
    
})(jQuery);

// Improved smooth scrolling functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links with the 'scroll' class
    const scrollLinks = document.querySelectorAll('a.scroll');
    
    // Add click event to each navigation link
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target section ID from the href attribute
            const targetId = this.getAttribute('href');
            
            // Handle external links (those that don't start with # or contain a full URL)
            if (!targetId.startsWith('#') && (targetId.includes('http') || !targetId.includes('#'))) {
                window.location.href = targetId;
                return;
            }
            
            // Extract just the hash part for IDs
            const hashPart = targetId.includes('#') ? targetId.split('#')[1] : targetId.replace('#', '');
            
            // Find the target element
            const targetElement = document.getElementById(hashPart);
            
            // If target element exists, scroll to it
            if (targetElement) {
                // Get header height for offset
                const headerHeight = document.querySelector('.header').offsetHeight;
                
                // Calculate position
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight - 20;
                
                // Smooth scroll to element
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
                
                // Update active class
                scrollLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            } else {
                // If it's a link to another page with no hash
                if (!targetId.includes('#')) {
                    window.location.href = targetId;
                }
            }
        });
    });
    
    // Active link highlighting when scrolling
    window.addEventListener('scroll', function() {
        const scrollPos = window.scrollY || document.documentElement.scrollTop;
        const headerHeight = document.querySelector('.header').offsetHeight || 0;
        
        // Check each section's position and update active class accordingly
        document.querySelectorAll('section[id], div[id="services"], div[id="about"]').forEach(section => {
            const sectionTop = section.offsetTop - headerHeight - 100;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                document.querySelectorAll('.nav.menu li a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId || 
                        link.getAttribute('href').endsWith('#' + sectionId)) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
    
    // Initialize active menu link based on current URL
    initActiveMenuLinkDom();
});

// Function to initialize active menu link based on current URL for vanilla JS
function initActiveMenuLinkDom() {
    const currentUrl = window.location.pathname;
    const currentHash = window.location.hash;
    
    document.querySelectorAll('.nav.menu li a').forEach(link => {
        const linkHref = link.getAttribute('href');
        
        // Check if this is the current page
        if (currentUrl.endsWith(linkHref) || 
            (currentHash && linkHref && linkHref.endsWith(currentHash))) {
            document.querySelectorAll('.nav.menu li').forEach(item => {
                item.classList.remove('active');
            });
            link.parentElement.classList.add('active');
            link.classList.add('active');
        }
    });
}

// Add iOS Safari detection and fadeSection fix at the end of the document ready function
document.addEventListener("DOMContentLoaded", function() {
    // Fix for fadeSection visibility on iOS Safari
    function isIOS() {
        return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    }
    
    if (isIOS()) {
        // Apply specific iOS fixes
        const fadeSections = document.querySelectorAll('.fadeSection');
        fadeSections.forEach(section => {
            section.style.opacity = '1';
            section.style.transform = 'none';
            section.style.visibility = 'visible';
        });
        
        console.log("iOS detected - Applied fadeSection visibility fix");
    }
});
