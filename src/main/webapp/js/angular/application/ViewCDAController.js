cdaApp.controller('ViewCDAController', function($scope, $http, $sce, FileUploader) {
	
$scope.showIFrame = false;
	
	$scope.selectedFile = [];
	
	$scope.uploader = new FileUploader({
		 url: 'uploadCDAFile'
	 });
	 
	 $scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
		 $scope.uploader.queue[0].remove();
		 $scope.processResponse(response);
		 $scope.showIFrame = true;
    };
    $scope.uploader.onErrorItem = function(fileItem, response, status, headers) {
   	 $scope.uploader.queue[0].remove();
    };
	
    $scope.uploader.onAfterAddingFile = function () {
       /* $scope.uploadProgress = 0;
        $scope.selectedFile = $files;*/
    	if ($scope.uploader.queue.length > 1){
    		var lastAdded = $scope.uploader.queue[$scope.uploader.queue.length - 1];
    		$scope.uploader.clearQueue();
    		$scope.uploader.queue.push(lastAdded); 
    	}
    };
	
    $scope.clear = function () {
        angular.element("input[type='file']").val(null);
    };
    
    $scope.upload = function()
    {
    	$scope.uploader.queue[0].upload();
    }
    
    
	$scope.testObject = {
			"patient": "Duck Donald",
			"DOB" : "January 23, 1982",
			"sex" : "Male",
			"contactInfo": "534 Erewhon St. PleasantVille, Vic 3999, Tel: (03) 5555 6473",
			"patientID" : "pat1 2.16.840.1.113883.3.608.1.1",
			"documentID" : "916F4EE3-54CE-42CF-868A-2743411F9A88",
			"documentCreated" :"December 21, 2015, 20:21:15, PST",
			"author" : "Adam Careful",
			"items": [{"name" : "Allergies and Adverse Reactions",
						"types" : ["ALLERGENIC EXTRACT, PENICILLIN, Hives", "Fish - dietary (substance)", "Allergic to Amoxicillin Pot Clavulanate, hives, Active Problem", "Allergic to Amoxicillin, Rash, Active Problem", "Allergic to bee stings, swelling, Active Problem" ]
					   },
					   {"name" : "Medications",
						"types" : ["00021695, Novo-Prednisone", "0131314003, Amoxicillin (Amoxcillin Trihydrate) 250mg/5mL", "20091215130300, ACETAMINOPHEN 500MG CAP, ACTIVE", "20091215130200, DIPHENHYDRAMINE HCL 25MG TAB, INACTIVE"]
					   },
					   {"name" : "Results",
						"types" : ["Body temperature, 39, degrees C", "Hemoglobin [Mass/volume] in Blood, 7.2, g/dl", "HEMOGLOBIN. is 11.2", "ANTIBODY SCREEN. is NEGATIVE", "CT, head is Small high right occipital lobe contusion. No evidence of extra-axial blood. Significant sinus disease." ]
					   },
					   {"name" : "History of procedures",
							"types" : ["20091215000000, TOTAL KNEE REPLACEMENT", "20091215000000, OTHER COMPUTER ASSISTED SURGERY" ]
						  }
			]
	};
	
	
	
	$scope.viewCDA = function(){
		$http({
			method: 'GET',
			url: "getCDAResource",
			headers: {
		            'Content-Type': 'application/json'
			}
		}).then(function(result){
			$scope.object = result.data;
			$scope.processResponse($scope.object);
			$scope.showIFrame = true;
		}, function(error){
			alert(error.status + " " + error.statusText);
		});
	}
	
	$scope.processResponse = function(object){
		var newItems = [];
		for(var i = 0; i< object.ClinicalDocument.component.structuredBody.component.length; i++){
			var component = object.ClinicalDocument.component.structuredBody.component[i];
			for (var j = 0; j<component.section.length ; j++){
				newItems.push($scope.processSection(component.section[j]));
			}
			if (component.section && !component.section.length){
				newItems.push($scope.processSection(component.section));
			}
			
		}
		
		$scope.testObject.items = newItems;
		if (object.ClinicalDocument.recordTarget.patientRole.patient.name.length){
			if (object.ClinicalDocument.recordTarget.patientRole.patient.name[0].family.content){
				$scope.testObject.patient = object.ClinicalDocument.recordTarget.patientRole.patient.name[0].family.content + " " + object.ClinicalDocument.recordTarget.patientRole.patient.name[0].given;
			}
			else{
				$scope.testObject.patient = object.ClinicalDocument.recordTarget.patientRole.patient.name[0].family + " " + object.ClinicalDocument.recordTarget.patientRole.patient.name[0].given;
			}
				
		}
		else{
			if (object.ClinicalDocument.recordTarget.patientRole.patient.name.family.content){
				$scope.testObject.patient = object.ClinicalDocument.recordTarget.patientRole.patient.name.family.content + " " + object.ClinicalDocument.recordTarget.patientRole.patient.name.given;
			}
			else{
				$scope.testObject.patient = object.ClinicalDocument.recordTarget.patientRole.patient.name.family + " " + object.ClinicalDocument.recordTarget.patientRole.patient.name.given;
			}
		}
		$scope.testObject.DOB = object.ClinicalDocument.recordTarget.patientRole.patient.birthTime['value'];
		$scope.testObject.sex =  object.ClinicalDocument.recordTarget.patientRole.patient.administrativeGenderCode['-displayName'];
		$scope.testObject.contactInfo = object.ClinicalDocument.recordTarget.patientRole.addr.streetAddressLine + ", " +
										object.ClinicalDocument.recordTarget.patientRole.addr.city + ", " + 
										object.ClinicalDocument.recordTarget.patientRole.addr.state+ ", " + 
										object.ClinicalDocument.recordTarget.patientRole.addr.postalCode+ ", " + 
										object.ClinicalDocument.recordTarget.patientRole.addr.country;
		
		if (!object.ClinicalDocument.author.length){
			if (!object.ClinicalDocument.author.assignedAuthor.assignedPerson.name.family){
				$scope.testObject.author = object.ClinicalDocument.author.assignedAuthor.assignedPerson.name;
				return;
			}
			$scope.testObject.author = object.ClinicalDocument.author.assignedAuthor.assignedPerson.name.family;
			if (typeof object.ClinicalDocument.author.assignedAuthor.assignedPerson.name.given === 'string' || object.ClinicalDocument.author.assignedAuthor.assignedPerson.name.given instanceof String ){
				$scope.testObject.author = + " " + object.ClinicalDocument.author.assignedAuthor.assignedPerson.name.given;
			}
			else
			{
				$scope.testObject.author = + " " + object.ClinicalDocument.author.assignedAuthor.assignedPerson.name.given[0];
			}
		}
		else{
			if (!object.ClinicalDocument.author[0].assignedAuthor.assignedPerson.name.family){
				$scope.testObject.author = object.ClinicalDocument.author[0].assignedAuthor.assignedPerson.name;
				return;
			}
			$scope.testObject.author = object.ClinicalDocument.author[0].assignedAuthor.assignedPerson.name.family;
			if (typeof object.ClinicalDocument.author[0].assignedAuthor.assignedPerson.name.given === 'string' || object.ClinicalDocument.author[0].assignedAuthor.assignedPerson.name.given instanceof String ){
				$scope.testObject.author = + " " + object.ClinicalDocument.author[0].assignedAuthor.assignedPerson.name.given;
			}
			else
			{
				$scope.testObject.author = + " " + object.ClinicalDocument.author[0].assignedAuthor.assignedPerson.name.given[0];
			}
		}
		
		
	}
	
	$scope.processSection = function(section){
		var found = false;
		var item = new Object();
		item['title'] = section.title;
		if (section.text.table && !section.text.table.length){
			item['table'] = [];
			item['table'].push($scope.processTable(section.text.table));
			found = true;
		}
		
		if (section.text.table && section.text.table.length > 0){
			item['table'] = [];
			for(var i = 0; i < section.text.table.length; i++){
				item['table'].push($scope.processTable(section.text.table[i]))
			}
			found = true;
		}
		
		/*if (section.text.content)
		{
			item['content'] = [];
			if (section.text.content.content){
				for (var i = 0; i<section.text.content.content.length; i++){
					item['content'].push(section.text.content.content[i]);
				}
			}
			else
			{
				item['content'].push(section.text.content);
			}
			
			found = true;
		}
		*/
		if(section.text.list && !section.text.list.length){
			item['list'] = [];
			var listObject = new Object();
			if (section.text.list.caption){
				listObject['caption'] = section.text.list.caption;
			}
			listObject['listitem'] = [];
			if (section.text.list.item && !section.text.list.item.length){

				listObject['listitem'].push(section.text.list.item);
			}
			else{
				if (typeof section.text.list.item === 'string' || section.text.list.item instanceof String){
					listObject['listitem'].push(section.text.list.item);
				}
				else{
					for (var i = 0; i<section.text.list.item.length; i++){
						listObject['listitem'].push(section.text.list.item[i]);
					}
				}
			}
			item['list'].push(listObject);
			found = true;
		}
		
		if(section.text.list && section.text.list.length>0){
			var complexSection = false;
			item['list'] = [];
			for (var i = 0; i<section.text.list.length; i++ ){
				var listObject = new Object();
				if (section.text.list[i].caption){
					listObject['caption'] = section.text.list[i].caption;
				}
				listObject['listitem'] = [];
				if (typeof section.text.list[i].item === 'string' || section.text.list[i].item instanceof String){
					listObject['listitem'].push(section.text.list.item);
				}
				else if (section.text.list[i].item && !section.text.list[i].item.length){
						listObject = this.processAdditionalLists(section.text.list[i].item);
						item['list'].push(listObject);
						complexSection = true;
					
				} else{
					for (var j = 0; j<section.text.list[i].item.length; j++){
						if (typeof section.text.list[i].item[j] === 'string' || section.text.list[i].item[j] instanceof String){
							listObject['listitem'].push(section.text.list[i].item[j]);
						}
						else {
							listObject = this.processAdditionalLists(section.text.list[i].item[j] );
							item['list'].push(listObject);
							complexSection = true;
						}
					}
				}
				if (!complexSection){
					item['list'].push(listObject);
				}
			}
			
			found = true;
		}
		
		if (!found) // there is no special elements but simple text
		{
			item['text'] = section.text; // text contains simple text
		}
		
		return item;
	}
	
	$scope.processAdditionalLists = function(complexItem){
		listObject = new Object();
		listObject['caption'] = complexItem.content;
		listObject['listitem'] = [];
		if (typeof complexItem.list.item === 'string' || complexItem.list.item instanceof String){
			listObject['listitem'].push(complexItem.list.item);
		}
		else{
			for (var i= 0; i <  complexItem.list.item.length; i++){
				listObject['listitem'].push(complexItem.list.item[i]);
			}
		}
		
		return listObject;
	}
	
	
	$scope.processTable = function(item){ // process table and create new object with more clear structure
		var table = new Object();
		var thead  = new Object();
		var tbody = new Object();
		var tr = [];
		var td = [];
		if (typeof item.thead != 'undefined'){
			if (!item.thead.tr.length){
				if (!item.thead.tr.th.length){
					if (typeof item.thead.tr.th === 'string' || item.thead.tr.th instanceof String){ // there can be a simple string
						td.push({'text':item.thead.tr.th,'colspan':1 });
					}
					else{
						if (item.thead.tr.th.colspan){
							td.push({'text':item.thead.tr.th.content,'colspan':item.thead.tr.th.colspan });
						}
						else{
							td.push({'text':item.thead.tr.th.content,'colspan':1 });
						}
					}
				}
				
				for (var i = 0; i< item.thead.tr.th.length; i++){
					if (typeof item.thead.tr.th[i] === 'string' || item.thead.tr.th[i] instanceof String){ // there can be a simple string
						td.push({'text':item.thead.tr.th[i],'colspan':1 });
					}
					else{
						if (item.thead.tr.th[i].colspan){
							td.push({'text':item.thead.tr.th[i].content,'colspan':item.thead.tr.th[i].colspan });
						}
						else{
							td.push({'text':item.thead.tr.th[i].content,'colspan':1 });
						}
					}
					
				}
			
				var trObj = new Object();
				trObj['th'] = td;
				tr.push(trObj);
				thead['tr'] = tr;
				tr = [];
				td = [];
				table['thead'] = thead;
			}
			else {
				for (var i  = 0; i<item.thead.tr.length; i++){
					
					if (!item.thead.tr[i].th.length){
						if (typeof item.thead.tr[i].th === 'string' || item.thead.tr[i].th instanceof String){ // there can be a simple string
							td.push({'text':item.thead.tr[i].th,'colspan':1 });
						}
						else{
							if (item.thead.tr[i].th.colspan){
								td.push({'text':item.thead.tr[i].th.content,'colspan':item.thead.tr[i].th.colspan });
							}
							else{
								td.push({'text':item.thead.tr[i].th.content,'colspan':1 });
							}
						}
					}
					
					for (var j = 0; j< item.thead.tr[i].th.length; j++){
						if (typeof item.thead.tr[i].th[j] === 'string' || item.thead.tr[i].th[j] instanceof String){ // there can be a simple string
							td.push({'text':item.thead.tr[i].th[j],'colspan':1 });
						}
						else{
							if (item.thead.tr[i].th[j].colspan){
								td.push({'text':item.thead.tr[i].th[j].content,'colspan':item.thead.tr[i].th[j].colspan });
							}
							else{
								td.push({'text':item.thead.tr[i].th[j].content,'colspan':1 });
							}
						}
						
					}
					
					var trObj = new Object();
					trObj['th'] = td;
					tr.push(trObj);
					td = [];
				}
				thead['tr'] = tr;
				tr = [];
				table['thead'] = thead;
			}
		}
		
		if (!item.tbody.tr.length){
			if (item.tbody.tr.th){
				if (typeof item.tbody.tr.th === 'string' || item.tbody.tr.th instanceof String){ // there can be a simple string
					td.push({'text':item.tbody.tr.th});
				}
				else{
					td.push({'text':item.tbody.tr.th.content});
				}
			}
			if (typeof item.tbody.tr.td === 'string' || item.tbody.tr.td instanceof String){ // there can be a simple string
				td.push({'text':item.tbody.tr.td});
			}
			else
			{
			for (var i = 0; i< item.tbody.tr.td.length; i++){
				var itemTD = item.tbody.tr.td[i];
				var found  = false;
				if (itemTD.length && typeof itemTD != 'string'){
					for(var j = 0; j< itemTD.length; j++ ){
						if (typeof itemTD[j] === 'string' || itemTD[j] instanceof String){
							td.push({'text': itemTD[j]});
							found = true;
							break;
						}
					}
				}
				if (itemTD.list){
					var list = [];
					if (itemTD.list.length){
						for(var j = 0; j< itemTD.list.length; j++ ){
							list.push(this.processListObj(itemTD.list[j]));
						}
					}
					else
					{
						list.push(this.processListObj(itemTD.list));
					}
					td.push({'list': list});
					found = true;
				}
				
				if(itemTD['content']){
					td.push({'text':itemTD['content']});
					found = true;
				}
				
				if (itemTD['linkHtml']){
					td.push({'link': itemTD['linkHtml']});
					found = true;
				}
				
				if (!found){
					td.push({'text':itemTD});
				}
				/*if (!itemTD['content'] && !itemTD.list ){
					td.push({'text':itemTD});
				}
				else if (!itemTD.list){
					td.push({'text':itemTD['content']});
				}
				else{
					var list = [];
					if (itemTD.list.length){
						for(var j = 0; j< itemTD.list.length; j++ ){
							list.push(this.processListObj(itemTD.list[j]));
						}
					}
					else
					{
						list.push(this.processListObj(itemTD.list));
					}
					td.push({'list': list});
				}*/
			}
			}
			
			
			var trObj = new Object();
			trObj['td'] = td;
			tr.push(trObj);
			tbody['tr'] = tr;
			tr = [];
			td = [];
			table['tbody'] = tbody;
		}
		else
		{
			for(var i = 0;  i< item.tbody.tr.length; i++){
				var itemTR = item.tbody.tr[i]
				if (itemTR.th){
					if (typeof itemTR.th === 'string' || itemTR.th instanceof String){ // there can be a simple string
						td.push({'text':itemTR.th});
					}
					else{
						td.push({'text':itemTR.th.content});
					}
				}
				if (typeof  itemTR.td === 'string' ||  itemTR.td instanceof String){ // there can be a string 
					td.push({'text': itemTR.td});
				}
				else
				{
				for (var j = 0; j< itemTR.td.length; j++){
					var itemTD = itemTR.td[j]
					var found  = false;
					if (itemTD.length && typeof itemTD != 'string'){
						for(var k = 0; k< itemTD.length; k++ ){
							if (typeof itemTD[k] === 'string' || itemTD[k] instanceof String){
								td.push({'text': itemTD[k]});
								found = true;
								break;
							}
						}
					}
					if (itemTD.list){
						var list = [];
						if (itemTD.list.length){
							for(var k = 0; k< itemTD.list.length; k++ ){
								list.push(this.processListObj(itemTD.list[k]));
							}
						}
						else
						{
							list.push(this.processListObj(itemTD.list));
						}
						td.push({'list': list});
						found = true;
					}
					
					if(itemTD['content']){
						td.push({'text':itemTD['content']});
						found = true;
					}
					
					if (itemTD['linkHtml']){
						td.push({'link': itemTD['linkHtml']});
						found = true;
					}
					
					if (!found){
						td.push({'text':itemTD});
					}
					
					/*if (!itemTD['content'] && !itemTD.list ){
						td.push({'text':itemTD});
					}
					else if (!itemTD.list){
						td.push({'text':itemTD['content']});
					}
					else{
						var list = [];
						
						if (itemTD.list.length){
							for(var k = 0; k< itemTD.list.length; k++ ){
								list.push(this.processListObj(itemTD.list[k]));
							}
						}
						else
						{
							list.push(this.processListObj(itemTD.list));
						}
							
						td.push({'list': list});
					}*/
				}
				}
				var trObj = new Object();
				trObj['td'] = td;
				td = [];
				tr.push(trObj);
			}
			
			tbody['tr'] = tr;
			tr = [];
			td = [];
			table['tbody'] = tbody;
		}
		
		if (typeof table.thead != 'undefined'){
			for (var i = 0; i< table.tbody.tr.length; i++){
				if (table.tbody.tr[i].td.length < table.thead.tr[table.thead.tr.length - 1].th.length){
					for(j = 0; j< table.thead.tr[table.thead.tr.length - 1].th.length - table.tbody.tr[i].td.length; j++ ){
						table.tbody.tr[i].td.push({"text": ""});
					}
				}
			}
		}
		
		return table;
	}
	
	
	$scope.processListObj = function(list){
		var listObj = new Object();
		if (typeof list.caption != 'undefined'){
			listObj['caption'] = list.caption;
		}
		else {
			listObj['caption']  = "";
		}
		
		if (list.item.length){
			var content = [];
			var tables = [];
			for(var i = 0; i< list.item.length; i++){
				if (typeof list.item[i].content != 'undefined'){
					if(typeof list.item[i].content === 'string' || list.item[i].content instanceof String){
						if ((content.indexOf(list.item[i].content) < 0) && list.item[i].content != ""){
							content.push(list.item[i].content)
						}
					}
					else{
						for(var j = 0; j< list.item[i].content.length; j++)
						{
							if ((content.indexOf(list.item[i].content[j]) < 0) && list.item[i].content[j] != ""){
								content.push(list.item[i].content[j])
							}
						}
					}
					
				}
				if (typeof list.item[i].table != 'undefined'){
					if (!list.item[i].table.length){
						tables.push(this.processTable(list.item[i].table));
					}
					else{
						for(var j = 0;j< list.item[i].table.length;j++ ){
							tables.push(this.processTable(list.item[i].table[j]));
						}
					}
				}
			}
			
			listObj['content'] = content.length!=0? content : "";
			listObj['table'] = tables.length != 0? tables: ""; 
			
		}
		else{
			
			var content = [];
			var tables = [];
			if (typeof list.item.content != 'undefined'){
				var content = [];
				if(typeof list.item.content === 'string' || list.item.content instanceof String){
					
					if ((content.indexOf(list.item.content) < 0) && list.item.content != ""){
						content.push(list.item.content)
					}
				}
				else{
					for(var i = 0; i< list.item.content.length; i++)
					{
						if ((content.indexOf(list.item.content[i]) < 0) && list.item.content[i] != ""){
							content.push(list.item.content[i])
						}
					}
				}
			}
			
			if (typeof list.item.table != 'undefined'){
				var tables = [];
				if (!list.item.table.length){
					tables.push(this.processTable(list.item.table));
					listObj['table'] = this.processTable(list.item.table);
				}
				else{
					for(var i = 0;i< list.item.table.length;i++ ){
						tables.push(this.processTable(list.item.table[i]));
					}
				}
			}
			
			listObj['content'] = content.length!=0? content : "";
			listObj['table'] = tables.length != 0? tables: ""; 
		}	
		
		return listObj;
	}
	
	
	$scope.viewCCD = function(){
		var i = 0;
		var newItems = [];
		while(i< $scope.testObject.items.length){
			var j = i+1;
			if (j<$scope.testObject.items.length)
			{
				newItems.push({"first": $scope.testObject.items[i], "second":$scope.testObject.items[j]});
			}
			else
			{
				newItems.push({"first": $scope.testObject.items[i], "second":{"name": "", "types":[]}});
			}
			i = j +1;
		}
		
		$scope.testObject.items = newItems;
		
		$scope.showIFrame = true;
	}
	
	$scope.backToList = function(){
		$scope.showIFrame = false;
	}
	
	
});