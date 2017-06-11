var tmpUrl = 0;
var HasDownloadFinished = false;
var TotalImagesForDownload = 0;
var TotalDownloadedImages = 0;
var DownloadFailed = false;
var imgsDownload = [];


function CheckData() {
    if (typeof FusionData === 'undefined') {
        HideLoadingScreen();
        return;
    }
    
    var newData = localStorage.getItem("FusionDataTemp");
    var oldData = localStorage.getItem("FusionData");
    
    
    
    if (newData != oldData && false) {
        
        var oldDataParsed = JSON.parse(oldData);
        var newDataParsed = JSON.parse(newData);
        
        var oldDataImages = GetAllImages(oldDataParsed);
        var newDataImages = GetAllImages(newDataParsed);
        
        
        //set images for delete
        var imgsDelete = [];
        
        var imgFound = false;
        
        for (var i = 0; i < oldDataImages.length; i++) {
            imgFound = false;
            
            for (var k = 0; k < newDataImages.length; k++) {
                if (oldDataImages[i] == newDataImages[k]) {
                    imgFound = true;
                    break;
                }
            }
            
            if (imgFound == false) {
                imgsDelete.push(oldDataImages[i])
            }
        }
        
        //set images for download
        for (var i = 0; i < newDataImages.length; i++) {
            imgFound = false;
            
            for (var k = 0; k < oldDataImages.length; k++) {
                if (newDataImages[i] == oldDataImages[k]) {
                    imgFound = true;
                    break;
                }
            }
            
            if (imgFound == false) {
                imgsDownload.push(newDataImages[i])
            }
        }
        TotalImagesForDownload = imgsDownload.length;
        
        //delete all images
        DeleteAllImagesFromDevice(imgsDelete);
        //download all images
        DownloadAllImagesFromServer(imgsDownload);
        
    } else {
        //remove loading screen
        HideLoadingScreen();
        
        $('#init_app_manually').click();
        
        InitJqueryScripts();
    }
    
}


function ShowLoadingScreen() {
    $('#loadingScreen').show();
}
function HideLoadingScreen() {
    InitializeApp();
    $('#loadingScreen').hide();
}

function DeleteAllImagesFromDevice(imgsDelete) {
    
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
                             dataDir = fileSystem.root.getDirectory("images", { create: true }, function (dir) {
                                                                    try {
                                                                    for (var i = 0; i < imgsDelete.length; i++) {
                                                                    DeleteFile(dir);
                                                                    }
                                                                    } catch (error) {
                                                                    console.log(error);
                                                                    //alert("Catch error getDirectory: " + error);
                                                                    }
                                                                    });
                             }, null);
    
}
function DownloadAllImagesFromServer(imgsDownload) {
    
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
         dataDir = fileSystem.root.getDirectory("images", { create: true }, function (dir) {
            try {
                if (TotalImagesForDownload == 0)
                    HideLoadingScreen();

                console.log(dir);
                
                //for (var i = 0; i < imgsDownload.length; i++) {

                for (var i = 0; i < 10; i++) {
                    DownloadFile(dir);
                }
                //}
            } catch (error) {
                console.log(error);
                //alert("Catch error getDirectory: " + error);
            }
        });
     }, null);
    
}
var imgdir;
var dwnCounter = 0;
function DownloadFile(dir) {
    
    if (imgsDownload.length == 0) {
        if (HasDownloadFinished == false) {
            HasDownloadFinished = true;
            
            HideLoadingScreen();
            
            $('#init_app_manually').click();
            
            InitJqueryScripts();
            
            if (typeof newData !== 'undefined') {
                localStorage.setItem("FusionData", newData);
            }
        }
        
        return;
    }
    
    var imgDownload = imgsDownload.pop();
    
    var uri = encodeURI(DownloadURL + imgDownload);
    
    var ImagePath = dir.toURL() + imgDownload;
    
    var fileTransfer = new FileTransfer();
    
    dir.getFile(imgDownload, { create: false }, function (entry) {
                //console.log("Image exists: " + entry.toURL());
                dwnCounter++;
                DownloadFile(dir);
                }, function () {
                fileTransfer.download(
                                      uri,
                                      ImagePath,
                                      function (entry) {
                                      console.log("Download complete" + entry.toURL());
                                      dwnCounter++;
                                      DownloadFile(dir);
                                      
                                      },
                                      function (error) {
                                      dwnCounter++;
                                      DownloadFile(dir);
                                      console.log("download error source " + error.source);
                                      },
                                      false,
                                      {
                                      headers: {
                                      "Authorization": "Basic dGVzdHVzZXJuYW1lOnRlc3RwYXNzd29yZA=="
                                      }
                                      }
                                      );
                });
}

function DeleteFile(dir, file) {
    try {
        dir.getFile(file, { create: false }, function (fileDir) {
                    fileDir.remove(function (file) {
                                   console.log("Image removed!");
                                   }, function () {
                                   alert("error deleting the file " + error.code);
                                   });
                    });
    }
    catch (error) {
        alert("DeleteFile: " + error);
    }
}


function GetAllImages(data) {
    var imageList = [];
    
    
    for (var i = 0; i < data.AboutUsPages.length; i++) {
        if (data.AboutUsPages[i].styleid != 4) {
            if (data.AboutUsPages[i].pagebgimageid != "0" && data.AboutUsPages[0].pagebgimageid != null)
                imageList.push(Images_GetImageByID(data, data.AboutUsPages[i].pagebgimageid));
        }
        if (data.AboutUsPages[i].styleid == 4) {
            if (data.AboutUsPages[i].bgimageid1 != "0" && data.AboutUsPages[0].bgimageid1 != null)
                imageList.push(Images_GetImageByID(data, data.AboutUsPages[i].bgimageid1));
            if (data.AboutUsPages[i].bgimageid2 != "0" && data.AboutUsPages[0].bgimageid2 != null)
                imageList.push(Images_GetImageByID(data, data.AboutUsPages[i].bgimageid2));
            if (data.AboutUsPages[i].bgimageid3 != "0" && data.AboutUsPages[0].bgimageid3 != null)
                imageList.push(Images_GetImageByID(data, data.AboutUsPages[i].bgimageid3));
            if (data.AboutUsPages[i].bgimageid4 != "0" && data.AboutUsPages[0].bgimageid4 != null)
                imageList.push(Images_GetImageByID(data, data.AboutUsPages[i].bgimageid4));
        }
    }
    for (var i = 0; i < data.Inspirations.length; i++) {
        var CurInspiration = data.Inspirations[i];
        for (var j = 0; j < CurInspiration.Galleries.length; j++) {
            var CurGallery = CurInspiration.Galleries[j];
            
            var tmpImageList = Galleries_GetImages(CurGallery, CurInspiration.pagetype);
            
            var tmpArray = imageList.concat(tmpImageList).unique();
            
            imageList = tmpArray;
        }
    }
    for (var i = 0; i < data.CategoryPages.length; i++) {
        var CurCategoryPage = data.CategoryPages[i];
        if (CurCategoryPage.pagebgimageid != "0" && CurCategoryPage.pagebgimageid != null)
            imageList.push(Images_GetImageByID(data, CurCategoryPage.pagebgimageid));
        
        for (var j = 0; j < CurCategoryPage.Galleries.length; j++) {
            var CurGallery = CurCategoryPage.Galleries[j];
            
            var tmpImageList = Galleries_GetImages(CurGallery, CurCategoryPage.pagetype);
            
            var tmpArray = imageList.concat(tmpImageList).unique();
            
            imageList = tmpArray;
        }
    }
    for (var i = 0; i < data.SampleCategories.length; i++) {
        var CurSampleCategory = data.SampleCategories[i];
        if (CurSampleCategory.pagebgimageid != "0" && CurSampleCategory.pagebgimageid != null)
            imageList.push(Images_GetImageByID(data, CurSampleCategory.pagebgimageid));
        
        if (CurSampleCategory.bgimageid1 != "0" && CurSampleCategory.bgimageid1 != null)
            imageList.push(Images_GetImageByID(data, CurSampleCategory.bgimageid1));
        
        for (var j = 0; j < CurSampleCategory.Galleries.length; j++) {
            var CurGallery = CurSampleCategory.Galleries[j];
            
            var tmpImageList = Galleries_GetImages(CurGallery, CurSampleCategory.pagetype);
            
            var tmpArray = imageList.concat(tmpImageList).unique();
            
            imageList = tmpArray;
        }
    }
    
    
    return imageList;
}
function Images_GetImageByID(data, id) {
    for (var i = 0; i < data.Images.length; i++) {
        if (id == data.Images[i].uid)
            return data.Images[i].file;
    }
    return null;
}
function Galleries_GetImages(data, pagetype) {
    var imageList = [];
    
    var suffixes = [];
    switch (parseInt(pagetype)) {
        case 2:
            suffixes.push("_sample.");
            suffixes.push("_catalog.");
            break;
        case 3:
            suffixes.push("_four_images.");
            suffixes.push("_three_images_left.");
            suffixes.push("_three_images_right.");
            suffixes.push("_catalog.");
            break;
        case 4:
            suffixes.push("_catalog.");
            break;
    }
    
    for (var i = 0; i < data.Images.length; i++) {
        if (data.Images[i].isdefault) {
            for (var j = 0; j < suffixes.length; j++) {
                imageList.push(data.Images[i].file.replace('.', suffixes[j]));
            }
        }
        
        imageList.push(data.Images[i].file);
    }
    
    return imageList;
}

Array.prototype.unique = function () {
    var a = this.concat();
    for (var i = 0; i < a.length; ++i) {
        for (var j = i + 1; j < a.length; ++j) {
            if (a[i] === a[j])
                a.splice(j--, 1);
        }
    }
    
    return a;
};