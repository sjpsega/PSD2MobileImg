/*
<javascriptresource> 
<name>PSD2MobileImg</name> 
<menu>help</menu> 
<enableinfo>true</enableinfo> 
</javascriptresource>
*/

app.bringToFront(); 
// Set Adobe Photoshop CS5 to use pixels and display no dialogs
app.displayDialogs = DialogModes.NO; // suppress all dialogs
app.preferences.rulerUnits = Units.PIXELS;
app.preferences.typeUnits = TypeUnits.PIXELS;

(function(){
    var config = {
        imgFormat:"jpg",
        outputFolder:""
    };
    var win = new Window('dialog{\
                    text:"PSD2MobileImg",\
                    option:Group{\
                        orientation:"column",\
                        alignChildren: "left",\
                        imgFormat: Group{\
                            alignChildren: "left",\
                            t: StaticText{text:"Imgage Format"},\
                            jpg: RadioButton{text:"jpg", value:true},\
                            png8:RadioButton{text:"png-8"},\
                            gif:RadioButton{text:"gif"}\
                        },\
                        imgQuality: Group{\
                            alignChildren: "left",\
                            t: StaticText{text:"Image Quality", helpTip:"Image quality"},\
                            s: EditText{ text:"60", preferredSize: [50, 20] }\
                        },\
                        outputFolder: Group{\
                            orientation:"row",\
                            b: Button{text:"Output Folder", properties:{name:"open"}, helpTip:"Output Folder"},\
                            s: EditText  { text:"", preferredSize:[180, 20], helpTip:"defaultToMyDocument"}\
                        }\
                    },\
                    buttons:Group{\
                        ok: Button{text:"OK",  properties:{name:"ok"}},\
                        cancel: Button{text:"cancel",  properties:{name:"cancel"}}\
                    }\
                }');
    win.option.imgFormat.addEventListener('click', function(e){
        var target = e.target,
            imgQualityContainer = win.option.imgQuality;
        imgQualityContainer.enabled=false;
        switch(target.text){
            case "jpg":
                imgQualityContainer.enabled=true;
                config.imgFormat = 'jpg';
                break;
            case "png-8":
                config.imgFormat = 'png';
                break;
            case "gif":
                config.imgFormat = 'gif';
                break;
        }
    });
    //选择路径
    win.option.outputFolder.b.onClick = function(){
        var output = Folder.selectDialog ('Output Folder');
        if(output){
            win.option.outputFolder.s.text = config.outputFolder = output.fsName;
        }
    };
    //导出图片的格式
    var exportImg = {
        png: function(){
            var options = new ExportOptionsSaveForWeb();
            options.format = SaveDocumentType.PNG;
            options.PNG8 = true;
            return options;
        },
        jpg:function(){
            var options = new ExportOptionsSaveForWeb();
            options.format = SaveDocumentType.JPEG;
            options.quality = win.option.imgQuality.s.text;
            return options;
        },
        gif:function(){
            var options = new ExportOptionsSaveForWeb();
            options.format = SaveDocumentType.COMPUSERVEGIF;
            return options;
        }
    };
    win.buttons.ok.onClick = function(){
        if(config.outputFolder === ''){
            alert('请选择需要保存的路径');
            return;
        }
        //若路径不存在，则新建
        var imgFolder = new Folder(config.outputFolder);
        !imgFolder.exists && imgFolder.create();
        exportImgs();
        win.close();
    }
    win.show();
    function exportImgs(){
        var activeDoc = app.activeDocument;
        var savedState = activeDoc.activeHistoryState;
        //删格化，可能会报错，导致无法继续
        try{
            activeDoc.rasterizeAllLayers();
        }catch(e){
        }
        var docs = app.documents;
        var layers = activeDoc.artLayers;
        var tempLayer,tempBounds,left,top,width,height;;
        for(var i = 0; i<layers.length;i++){
            tempLayer = layers[i];
            if(tempLayer.visible && !tempLayer.isBackgroundLayer){
                tempBounds = tempLayer.bounds;
                left = tempBounds[0].value;
                top = tempBounds[1].value;
                width = tempBounds[2]-left.value;
                height = tempBounds[3]-top.value;
                if(width>0 && height>0){
                    activeDoc.activeLayer = tempLayer;
                    var selection = activeDoc.selection;
                    var rect = [[left,top],[left+width,top],[left+width,top+height],[left,top+height]];
                    selection.select(rect);
                    selection.copy();
                    var newDoc = docs.add(width,height,72,"tempDoc",NewDocumentMode.RGB,DocumentFill.TRANSPARENT,1,BitsPerChannelType.SIXTEEN);
                    newDoc.paste();
                    var filename = config.outputFolder+ '/' + tempLayer.name+'.'+config.imgFormat;
                    saveImg(filename,newDoc);
                 }
            }
        }
        //恢复到最初状态
        activeDoc.activeHistoryState = savedState;
    }

    function saveImg(filename,doc){
        var imgFile = new File (filename);
        var options = exportImg[config.imgFormat]();
        doc.exportDocument(imgFile, ExportType.SAVEFORWEB, options);
        doc.close(SaveOptions.DONOTSAVECHANGES);
        // WaitForRedraw();
    }

    // A helper function for debugging
    // It also helps the user see what is going on
    // if you turn it off for this example you
    // get a flashing cursor for a number time
    function WaitForRedraw()
    {
        var eventWait = charIDToTypeID("Wait")
        var enumRedrawComplete = charIDToTypeID("RdCm")
        var typeState = charIDToTypeID("Stte")
        var keyState = charIDToTypeID("Stte")
        var desc = new ActionDescriptor()
        desc.putEnumerated(keyState, typeState, enumRedrawComplete)
        executeAction(eventWait, desc, DialogModes.NO)
    }
})()
