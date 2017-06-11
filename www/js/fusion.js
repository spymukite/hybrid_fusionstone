$(document).ready(function () {
                  
                  
                  }); // end: $(document).ready()

function InitJqueryScripts() {
    $('#main_content .slider').slick({
                                     dots: false,
                                     arrows: false,
                                     infinite: false,
                                     autoplay: false,
                                     speed: 300,
                                     slidesToShow: 1,
                                     slidesToScroll: 1
                                     });
    
    //  Main Content Navigatiom
    $('#footer a').click(function (e) {
                         e.preventDefault();
                         var getCounter = $(this).attr('counter');
                         $('#main_content .slider').slick('slickGoTo', getCounter);
                         $(this).addClass('act');
                         $(this).parent().siblings('li').children('a').removeClass('act');
                         });
    
    $('#main_content .slider').on('afterChange', function (event, slick, currentSlide) {
                                  $('#footer a').removeClass('act');
                                  $('#footer a[counter="' + CatalogSlides[currentSlide] + '"]').addClass('act');
                                  });
    
    // Samples slider
    $('#samples .slider').slick({
                                dots: false,
                                arrows: false,
                                infinite: false,
                                autoplay: false,
                                speed: 300,
                                slidesToShow: 1,
                                slidesToScroll: 1
                                });
    
    // Samples Navigatiom
    $('#footer_samples a').click(function (e) {
                                 e.preventDefault();
                                 var getCounter = $(this).attr('counter');
                                 $('#samples .slider').slick('slickGoTo', getCounter);
                                 $(this).addClass('act');
                                 $(this).parent().siblings('li').children('a').removeClass('act');
                                 });
    
    $('#samples .slider').on('afterChange', function (event, slick, currentSlide) {
                             $('#footer_samples a').removeClass('act');
                             $('#footer_samples a[counter="' + currentSlide + '"]').addClass('act');
                             });
    
    // Lightbox Slider
    $('.lightbox_slider').slick({
                                dots: false,
                                arrows: false,
                                infinite: false,
                                autoplay: false,
                                speed: 300,
                                slidesToShow: 1,
                                slidesToScroll: 1
                                });
    
    
    // MITE //
    // On swipe event
    $('.lightbox_slider').on('afterChange', GallerySlick);
    // MITE //
    
    // Close Lightbox
    $('#close_lightbox').click(function (e) {
                               e.preventDefault();
                               $('#lightbox').hide();
                               
                               
                               var slickLen = $('.lightbox_slider').children().children().children().length;
                               
                               for (var i = 0; i < slickLen; i++) {
                               $('.lightbox_slider').slick('slickRemove', 0);
                               }
                               });
    
    $('#nix_contact_form').submit(function (e) {
                                  e.preventDefault();
                                  var formData = $(this).serialize();
                                  
                                  var url = Host + "/typo3conf/ext/fusion_app/Resources/Public/php/nix_service.php";
                                  
                                  $.ajax({
                                         type: 'GET',
                                         url: url,
                                         data: 'send_mail=1&' + formData,
                                         success: function (data) {
                                         ShowContactSuccessMsg();
                                         
                                         HideContactForm();
                                         
                                         },
                                         error: function (error) {
                                         ShowContactErrorMsg();
                                         HideContactForm();
                                         }
                                         })
                                  });
}

// MITE //

function ShowContactSuccessMsg() {
    $('.contact_msgs').removeClass('hidden');
    $('#contact_success_msg').removeClass('hidden');
}

function ShowContactErrorMsg() {
    $('.contact_msgs').removeClass('hidden');
    $('#contact_error_msg').removeClass('hidden');
}

function HideContactMsgs() {
    $('.contact_msgs').addClass('hidden');
    $('#contact_success_msg').addClass('hidden');
    $('#contact_error_msg').addClass('hidden');
    ShowContactForm();
}

function ShowContactForm() {
    $('#nix_contact_form').find("inpu[type=text]").val("");
    $('#nix_contact_form').find("inpu[type=email]").val("");
    $('#nix_contact_form').find("input[type=radio]").prop('checked', false);
    $('#nix_contact_form').removeClass('hidden');
}

function HideContactForm() {
    $('#nix_contact_form').addClass('hidden');
}


function RestartLighboxCounter() {
    $('#lightbox_counter .counter').text(1);
}

function GoToSlide(t, number) {
    $('#footer .ui-link').removeClass('act');
    $('#main_content .slider').slick('slickGoTo', number);
    $(t).addClass('act');
}

// MITE //
function SelectActiveMenuItem(t) {
    ClearActiveMenuItem();
    $(t).addClass('act');
}

function ClearActiveMenuItem() {
    $('#left_menu .left_menu_item a').removeClass('act');
}



var headerVisible = false;
function showHeader() {
    $('.ui-header-fixed').show();
    headerVisible = true;
}
function hideHeader() {
    $('.ui-header-fixed').hide();
    headerVisible = false;
}
var catalogFooterVisible = false;
var samplesFooterVisible = false;
function showCatalogFooter() {
    $('#main_content .slider').slick('slickGoTo', 0);
    $('#footer').show();
    catalogFooterVisible = true;
}
function hideCatalogFooter() {
    $('#footer').hide();
    catalogFooterVisible = false;
}

function showSamplesFooter(number) {
    $('#footer_samples').show();
    $('#footer_samples a').removeClass('act');
    $('#footer_samples a[counter="' + number + '"]').addClass('act');
    samplesFooterVisible = true;
}
function hideSamplesFooter() {
    $('#footer_samples').hide();
    samplesFooterVisible = false;
}


function GallerySlick(slick, currentSlide) {
    ChangeLightboxCounter(currentSlide.currentSlide+1);
}


var counter = 1;
var totalItems = 0;
function ChangeLightboxCounter(currentSlide) {
    console.log(currentSlide);
    $('#lightbox_counter .counter').text(currentSlide);
}

function test() {
    console.log('testing');
}