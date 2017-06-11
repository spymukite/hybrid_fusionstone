var Host = 'http://app.fusionstone.ca';
var UrlToImage = "";

function GetFusionDataFromLS() {
    var FusionDataOld = localStorage.getItem("FusionData");
    if (FusionDataOld == undefined) {
        FusionDataOld = {
            AboutUsPages: [],
            CategoryPages: [],
            Inspirations: [],
            SampleCategories: [],
        }

        localStorage.setItem("FusionData", JSON.stringify(FusionDataOld));

        return FusionDataOld;
    }
    return JSON.parse(FusionDataOld);
}

var FusionDataOld = GetFusionDataFromLS();

var app = angular.module("Fusion_App", []);

if (typeof FusionData !== 'undefined') {
    FusionDataOld = FusionData;
    localStorage.setItem("FusionDataTemp", JSON.stringify(FusionData));
}

app.filter('to_trusted', ['$sce', function ($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}]);


function InitializeApp() {
    $('#loadingClick').click();
};


function GoOffline() {
    IsOnline = false;
    $('#offlineClick').click();
};

function GoOnLine() {
    IsOnline = true;
    $('#onLineClick').click();
};
var CatalogSlides = [];

function Wall(parent) {
    this.Length = 0;
    this.LengthInch = 0;
    this.Height = 0;
    this.HeightInch = 0;

    this.Walls = parent;

    this.Last = true;

    this.TotalArea = 0;

    this.CalculateMeasurement = function () {

        if (this.Last && (this.Length > 0 || this.Height > 0)) {
            this.Last = false;
            this.Walls.push(new Wall(this.Walls));
        }

        var res = (this.Length + (this.LengthInch / 12)) * (this.Height + (this.HeightInch / 12));
        this.TotalArea = res.toFixed(2);
        return this.TotalArea;
    }
}


app.controller("Control_General", ['$scope', function ($scope) {
    $scope.Walls = [];
    $scope.Walls.push(new Wall($scope.Walls));

    $scope.Windows = [];
    $scope.Windows.push(new Wall($scope.Windows));


    $scope.TotalSquereFootageReq = function () {

        var totalWalls = 0;
        for (var i = 0; i < $scope.Walls.length; i++) {
            totalWalls += parseFloat($scope.Walls[i].TotalArea);
        }


        var totalWindows = 0;
        for (var i = 0; i < $scope.Windows.length; i++) {
            totalWindows += parseFloat($scope.Windows[i].TotalArea);
        }


        var res = totalWalls - totalWindows;
        return res.toFixed(2);
    }

    $scope.TotalLinearFootageReq = function () {
        var totalWalls = 0;
        for (var i = 0; i < $scope.Walls.length; i++) {
            totalWalls += $scope.Walls[i].Height + ($scope.Walls[i].HeightInch / 12);
        }

        var res = totalWalls.toFixed(2);
        return res;
    }

    $scope.StarterStripsReq = function () {
        var totalWalls = 0;
        for (var i = 0; i < $scope.Walls.length; i++) {
            if (parseFloat($scope.Walls[i].TotalArea) > 0)
                totalWalls += $scope.Walls[i].Length + ($scope.Walls[i].LengthInch / 12);
        }


        var totalWindows = 0;
        for (var i = 0; i < $scope.Windows.length; i++) {
            if (parseFloat($scope.Windows[i].TotalArea) > 0)
                totalWindows += $scope.Windows[i].Length + ($scope.Windows[i].LengthInch / 12);
        }


        res = (totalWalls + totalWindows) / 4;
        res = Math.ceil(res);

        return res.toFixed(2);
    }



    $scope.LoadApp = function () {
        $scope.ChangeLocation(window.location.hash, true);
    }
    $scope.SetOfflineMode = function () {
        $scope.IsOnline = IsOnline;
    }

    $scope.SetOnLineMode = function () {
        $scope.IsOnline = IsOnline;
    }

    $scope.CurrentState = 0;

    $scope.PreviousScreen = "";

    $scope.ChangeLocation = function (newLocation, init) {

        if (newLocation == window.location.hash && init == undefined)
            return;

        $scope.PreviousScreen = window.location.hash;

        switch (newLocation) {
            case "#catalog_or_samples":
                $scope.CurrentState = 2;
                break;
            case "#main_content":
                $scope.CurrentState = 3;
                break;
            case "#samples_landing":
                $scope.CurrentState = 4;
                break;
            case "#samples":
                $scope.CurrentState = 5;
                break;
            case "#favorites":
                $scope.CurrentState = 6;
                break;
            case "#purchase":
                $scope.CurrentState = 7;
                break;
            case "#contact":
                $scope.CurrentState = 8;
                break;
            case "#estimator":
                $scope.CurrentState = 9;
                break;
            case "#support":
                $scope.CurrentState = 10;
                break;
            case "#estimator":
                $scope.CurrentState = 11;
                break;
            case '#elevate':
                window.initVisualizer();
                $scope.CurrentState = 12;
            default:
                $scope.CurrentState = 1;
                break;
        }
    }

    $scope.GoBack = function () {
        if (window.location.hash == '#elevate' && window.backHistory && window.backHistory()) {
            return;
        }
        if (window.location.hash == $scope.PreviousScreen) {
            $scope.PreviousScreen = "";
        }

        //window.location.hash = $scope.PreviousScreen;
        $.mobile.changePage($scope.PreviousScreen);
        $scope.ChangeLocation($scope.PreviousScreen, true);
    }


    $scope.InitializeSlides = function () {
        var slidesCounter = 0;

        for (var i = 0; i < $scope.AboutUsPages.length; i++) {
            CatalogSlides[slidesCounter] = 0;
            slidesCounter++;
        }

        for (var i = 0; i < $scope.CatalogSamplesPage.length; i++) {
            $scope.PageSlides.push($scope.CatalogSamplesPage[i]);
            $scope.CatalogSamplesPage[i].Type = 1;
            $scope.CatalogSamplesPage[i].Counter = slidesCounter;
            CatalogSlides[slidesCounter] = slidesCounter;


            for (var k = 0; k < $scope.InspirationPage.length; k++) {
                if ($scope.InspirationPage[k].RefID != undefined && $scope.InspirationPage[k].RefID == $scope.CatalogSamplesPage[i].ID && $scope.InspirationPage[k].IsDefault == 1) {
                    $scope.PageSlides.push($scope.InspirationPage[k]);
                    $scope.InspirationPage[k].Type = 2;
                    $scope.CatalogSamplesPage[i].Counter = slidesCounter;
                    CatalogSlides[slidesCounter + 1] = slidesCounter;
                    slidesCounter++;
                    break;
                }
            }

            slidesCounter++;
        }

        $scope.InspirationPageCounter = slidesCounter;

        for (var i = 0; i < 3; i++) {
            CatalogSlides[slidesCounter] = $scope.InspirationPageCounter;
            slidesCounter++;
        }


    }

    $scope.openLightboxModal = function (images) {
        Lightbox.openModal(images, 0);
    };

    $scope.GetImageByID = function (id) {
        for (var i = 0; i < FusionDataOld.Images.length; i++) {
            var image = FusionDataOld.Images[i];
            if (image.uid == id) {

                return UrlToImages + image.file;  //return './images/galeries/' + image.File;
            }

        }
    }

    $scope.GetDefaultGalleryImage = function (gallery, type) {

        var suffix = ".";

        if (type == undefined) {
            return "";
        }

        switch (type) {
            case 1:
                suffix = "_catalog.";
                break;
            case 2:
                suffix = "_sample.";
                break;
            case 3:
                suffix = "_four_images.";
                break;
            case 4:
                suffix = "_three_images_left.";
                break;
            case 5:
                suffix = "_three_images_right.";
                break;
        }

        var tmpImage = "";

        if (gallery.isFavorite == undefined)
            gallery.isFavorite = false;

        for (var i = 0; i < gallery.Images.length; i++) {
            if (i == 0)
                tmpImage = UrlToImages + gallery.Images[i].file; //'./images/galeries/preview/' + gallery.Images[i].File;

            if (gallery.Images[i].isdefault) {
                return UrlToImages + gallery.Images[i].file.replace('.', suffix);  //'./images/galeries/preview/' + gallery.Images[i].File;
            }
        }

        return tmpImage.replace('.', suffix);
    };

    $scope.OpenLightbox = function (Page, Gallery) {

        $scope.SelectedGallery = Gallery;


        var tmpWidth = effectiveDeviceWidth();
        var tmpHeight = effectiveDeviceHeight();

        if (tmpWidth < tmpHeight) {
            var tmp = tmpWidth;
            tmpWidth = tmpHeight;
            tmpHeight = tmp;
        }

        for (var i = 0; i < Gallery.Images.length; i++) {
            //$('.lightbox_slider').slick('slickAdd','<div class="lightbox_slider_item"><img src="/images/galeries/'+Gallery.Images[i].File+'"></div>')
            $('.lightbox_slider').slick('slickAdd', '<div class="lightbox_slider_item"><div style="height:' + tmpHeight + 'px; width: ' + tmpWidth + 'px;background-size:cover;display:block;background-image:url(' + UrlToImages + Gallery.Images[i].file + ');"></div></div>')
        }

        totalItems = Gallery.Images.length;
        RestartLighboxCounter();
        $('#lightbox').show();
    };

    $scope.showSamplesFooter = function (number) {
        $('#samples .slider').slick("slickGoTo", number, false);
        $('#footer_samples').show();
        $('#footer_samples a').removeClass('act');
        $('#footer_samples a[counter="' + number + '"]').addClass('act');
        samplesFooterVisible = true;
    }

    $scope.ToggleFavoritesGallery = function (Page, Gallery) {
        event.preventDefault();

        if (Gallery.isFavorite == undefined || Gallery.isFavorite == false) {
            $scope.Favorites.push(Gallery);
            Gallery.isFavorite = true;

            if (Gallery.Parent.PageType != '3' && Gallery.Parent.PageType != 3) {
                $scope.AddSampleFavorite(Gallery);
            }
        }
        else {
            $scope.Favorites.remove(Gallery);
            Gallery.isFavorite = false;

            if (Gallery.Parent.PageType != '3' && Gallery.Parent.PageType != 3) {
                $scope.RemoveSampleFavorite(Gallery);
            }
        }

        if (Page != undefined || Page != null) {
            var hasFavorites = false;
            for (var i = 0; i < Page.Galleries.length; i++) {
                if (Page.Galleries[i].isFavorite) {
                    hasFavorites = true;
                    break;
                }
            }

            Page.hasFavorites = hasFavorites;
        }

        $scope.UpdateFavoriteToLS();
    }

    $scope.InitializeLanguage = function () {
        var lang = localStorage.getItem("language");
        if (lang == undefined) {
            localStorage.setItem("language", 1);
            lang = 1;
        }

        $scope.Language = lang;
    }

    $scope.SetFavoritesFromLS = function () {
        var fav = localStorage.getItem("favorites");
        if (fav != undefined) {
            fav = fav.split(',');
            //for (var i = 0; i < fav.length; i++) {
            //    fav[i] = parseInt(fav[i]);
            //}
        }
        else
            fav = [];

        for (var i = 0; i < $scope.CatalogSamplesPage.length; i++) {
            var galleries = $scope.CatalogSamplesPage[i].Galleries;
            for (var k = 0; k < galleries.length; k++) {
                galleries[k].Parent = $scope.CatalogSamplesPage[i];
                galleries[k].PageType = $scope.CatalogSamplesPage[i].PageType;

                if (fav.indexOf(galleries[k].uid) > -1) {
                    $scope.Favorites.push(galleries[k]);
                    $scope.AddSampleFavorite(galleries[k]);
                    galleries[k].isFavorite = true;
                }
                else
                    galleries[k].isFavorite = false;
            }
        }


        for (var i = 0; i < $scope.InspirationPage.length; i++) {
            var galleries = $scope.InspirationPage[i].Galleries;
            for (var k = 0; k < galleries.length; k++) {
                galleries[k].Parent = $scope.InspirationPage[i];
                galleries[k].PageType = $scope.InspirationPage[i].PageType;

                if (fav.indexOf(galleries[k].uid) > -1) {
                    $scope.Favorites.push(galleries[k]);
                    galleries[k].isFavorite = true;
                }
                else
                    galleries[k].isFavorite = false;
            }

        }


        for (var i = 0; i < $scope.StoneSamplesPage.length; i++) {
            var galleries = $scope.StoneSamplesPage[i].Galleries;
            $scope.StoneSamplesPage[i].hasFavorites = false;
            for (var k = 0; k < galleries.length; k++) {
                galleries[k].PageType = $scope.StoneSamplesPage[i].PageType;
                galleries[k].Parent = $scope.StoneSamplesPage[i];

                if (fav.indexOf(galleries[k].uid) > -1) {
                    $scope.Favorites.push(galleries[k]);
                    galleries[k].isFavorite = true;
                    $scope.AddSampleFavorite(galleries[k]);
                    $scope.StoneSamplesPage[i].hasFavorites = true;
                }
                else
                    galleries[k].isFavorite = false;
            }
        }
    }

    $scope.UpdateFavoriteToLS = function () {
        var ids = "";
        for (var i = 0; i < $scope.Favorites.length; i++) {
            if (i > 0)
                ids = ids + ",";

            ids = ids + $scope.Favorites[i].uid;
        }

        localStorage.setItem("favorites", ids);
    }

	
	
	$scope.CheckGalleryBeforeShow = function (sample){
		for(var i = 0; i < $scope.SampleFavorites.length;i++){
			for(var j =0; j< $scope.SampleFavorites[i].Samples.length;j++){
				if(sample.uid == $scope.SampleFavorites[i].Samples[j].uid)
				{
					if(sample.Visible)
						return true;
				}
				if(sample.Parent.PageTitle == $scope.SampleFavorites[i].Title){
					if(sample.title == $scope.SampleFavorites[i].Samples[j].title){
						if($scope.SampleFavorites[i].Samples[j].Visible == undefined){
							sample.Visible = true;
							return true;
						}
						else if($scope.SampleFavorites[i].Samples[j].Visible == true){
							if(sample.uid == $scope.SampleFavorites[i].Samples[j].uid)
								return true;
							return false;
						}
						else{
							return false;
						}
					}
				}
			}
		}
		return true;
	}
	
    $scope.AddSampleFavorite = function (sample) {

        var sampleCat = null;

        for (var i = 0; i < $scope.SampleFavorites.length; i++) {
            if ($scope.SampleFavorites[i].Title == sample.Parent.PageTitle) {
                sampleCat = $scope.SampleFavorites[i];
                break;
            }
        }

        if (sampleCat == null) {
            sampleCat = { Title: sample.Parent.PageTitle, Samples: [] };
            $scope.SampleFavorites.push(sampleCat);
        }

        sampleCat.Samples.push(sample);
    }

    $scope.RemoveSampleFavorite = function (sample) {

        var sampleCat = null;

        for (var i = 0; i < $scope.SampleFavorites.length; i++) {
            if ($scope.SampleFavorites[i].Title == sample.Parent.PageTitle) {
                sampleCat = $scope.SampleFavorites[i];
                break;
            }
        }

        if (sampleCat != null) {
            sampleCat.Samples.remove(sample);
            if (sampleCat.Samples.length == 0) {
                $scope.SampleFavorites.remove(sampleCat);
            }
        }
    }

    $scope.IsNotStoneSamplePage = function (item) {
        if (item.PageType == "2" || item.PageType == 2)
            return false;

        return true;
    }

    $scope.SetLanguage = function () {
        var suffix = "";

        if ($scope.Language == 2) {
            suffix = "fr";
            $scope.Strings = stringsFr;
        }
        else
            $scope.Strings = stringsEn;

        for (var i = 0; i < $scope.AboutUsPages.length; i++) {
            $scope.SetNixPageLanguage($scope.AboutUsPages[i], suffix);
        }

        for (var i = 0; i < $scope.CatalogSamplesPage.length; i++) {
            $scope.SetNixPageLanguage($scope.CatalogSamplesPage[i], suffix);
        }


        for (var i = 0; i < $scope.InspirationPage.length; i++) {
            $scope.SetNixPageLanguage($scope.InspirationPage[i], suffix);
        }


        for (var i = 0; i < $scope.StoneSamplesPage.length; i++) {
            $scope.SetNixPageLanguage($scope.StoneSamplesPage[i], suffix);
        }

    }

    $scope.SetNixPageLanguage = function (nixPage, suffix) {
        nixPage.PageClass = replaceAll(nixPage["pagetitle"], " ", "");

        nixPage.SectionTitle = nixPage["sectiontitle" + suffix];
        nixPage.PageTitle = nixPage["pagetitle" + suffix];
        nixPage.PageContent = nixPage["pagecontent" + suffix];
        nixPage.Title1 = nixPage["title1" + suffix];
        nixPage.Title2 = nixPage["title2" + suffix];
        nixPage.Title3 = nixPage["title3" + suffix];
        nixPage.Title4 = nixPage["title4" + suffix];
        nixPage.Subtitle1 = nixPage["subtitle1" + suffix];
        nixPage.Subtitle2 = nixPage["subtitle2" + suffix];
        nixPage.Subtitle3 = nixPage["subtitle3" + suffix];
        nixPage.Subtitle4 = nixPage["subtitle4" + suffix];
        nixPage.Content1 = nixPage["content1" + suffix];
        nixPage.Content2 = nixPage["content2" + suffix];
        nixPage.Content3 = nixPage["content3" + suffix];
        nixPage.Content4 = nixPage["content4" + suffix];

        nixPage.PageBGImageID = nixPage["pagebgimageid"];
        nixPage.RefID = nixPage["refid"];
        nixPage.ID = nixPage["uid"];
        nixPage.IsDefault = nixPage["isdefault"];
        nixPage.PageType = nixPage["pagetype"];
        nixPage.BGImageID1 = nixPage["bgimageid1"];
        nixPage.BGImageID2 = nixPage["bgimageid2"];
        nixPage.BGImageID3 = nixPage["bgimageid3"];
        nixPage.BGImageID4 = nixPage["bgimageid4"];

        for (var i = 0; i < nixPage.Galleries.length; i++) {
            $scope.SetNixGalleryLanguage(nixPage.Galleries[i], suffix);
        }
    }

    $scope.SetNixGalleryLanguage = function (nixGallery, suffix) {
        nixGallery.Title = nixGallery["title" + suffix];

        for (var i = 0; i < nixGallery.Images.length; i++) {
            nixGallery.Images[i].Name = nixGallery.Images[i]["name" + suffix];
        }
    }

    $scope.ChangeLanguage = function (lang) {
        $scope.Language = lang;
        localStorage.setItem("language", lang);
        $scope.SetLanguage();
    }

    $scope.InitializeApp = function () {

        $scope.Favorites = [];
        $scope.Strings = stringsEn;
        $scope.SampleFavorites = [];
        $scope.SelectedGallery = { Title: "", Images: [] };
        $scope.Language = 1;
        $scope.IsOnline = IsOnline;

        $scope.PageSlides = [];

        $scope.AboutUsPages = FusionDataOld.AboutUsPages;
        $scope.CatalogSamplesPage = FusionDataOld.CategoryPages;
        $scope.InspirationPage = FusionDataOld.Inspirations;
        $scope.StoneSamplesPage = FusionDataOld.SampleCategories;

        $scope.InitializeLanguage();
        $scope.SetLanguage();
        $scope.InitializeSlides();
        $scope.SetFavoritesFromLS();
    }



    $scope.InitializeApp();
}]);

function CalculateMeasurement(Length, Height) {
    return Length * Height;
}


Array.prototype.remove = function () {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

function replaceAll(string, find, replace) {
    return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}