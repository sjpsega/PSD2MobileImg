﻿app.bringToFront(); // Set Adobe Photoshop CS4 to use pixelsapp.preferences.rulerUnits = Units.PIXELS;app.preferences.typeUnits = TypeUnits.PIXELS;(function(){    var doc = app.activeDocument;    var docs = app.documents;    var layers = doc.artLayers;    var img = new File ('~/Desktop'+ '/' + 'bg.png');    var options = new ExportOptionsSaveForWeb();    options.format = SaveDocumentType.PNG;    options.PNG=true;    options.quality = 80;    //doc.exportDocument(img, ExportType.SAVEFORWEB, options);    //alert(layers.unixCompatible)    var tempLayer,tempBounds,left,top,width,height;;    for(var i = 0; i<layers.length;i++){        tempLayer = layers[i];        if(tempLayer.visible && !tempLayer.isBackgroundLayer){            tempBounds = tempLayer.bounds;            left = tempBounds[0];            top = tempBounds[1];            width = tempBounds[2]-left;            height = tempBounds[3]-top;            if(width>0 && height>0){                doc.activeLayer = tempLayer;                var selection = doc.selection;                var rect = [[left,top],[left+width,top],[left+width,top+height],[left,top+height]];                selection.select(rect);                selection.copy();                var newDoc = docs.add(doc.width,doc.height,72,"tempDoc",NewDocumentMode.RGB,DocumentFill.TRANSPARENT,1,BitsPerChannelType.SIXTEEN);                newDoc.paste();                var img = new File ('~/Desktop'+ '/' + tempLayer.name+'.png');                var options = new ExportOptionsSaveForWeb();                options.format = SaveDocumentType.PNG;                options.PNG=true;                options.quality = 80;                newDoc.exportDocument(img, ExportType.SAVEFORWEB, options);                newDoc.close(SaveOptions.DONOTSAVECHANGES);                WaitForRedraw();             }        }    }    function saveImg(){            }    // A helper function for debugging    // It also helps the user see what is going on    // if you turn it off for this example you    // get a flashing cursor for a number time    function WaitForRedraw()    {        var eventWait = charIDToTypeID("Wait")        var enumRedrawComplete = charIDToTypeID("RdCm")        var typeState = charIDToTypeID("Stte")        var keyState = charIDToTypeID("Stte")        var desc = new ActionDescriptor()        desc.putEnumerated(keyState, typeState, enumRedrawComplete)        executeAction(eventWait, desc, DialogModes.NO)    }})()