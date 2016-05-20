cdaApp.controller('ViewCDAController', function($scope, $http, $sce, FileUploader, $route) {
	
	$scope.showIFrame = false;
	$scope.errorCDA = false;
	
	$scope.reload = function(){
		$route.reload();
		$scope.showIFrame = false;
	}
	
	$scope.selectedFile = [];
	
	$scope.uploader = new FileUploader({
		 url: 'uploadCDAFile'
	 });
	 
	 $scope.uploader.onSuccessItem = function(fileItem, response, status, headers) {
		 $scope.processResponse(response);
		 if (!$scope.errorCDA){
			 $scope.uploader.queue[0].remove();
			 $scope.showIFrame = true;
		 }
    };
    $scope.uploader.onErrorItem = function(fileItem, response, status, headers) {
   	 $scope.uploader.queue[0].remove();
    };
	
    $scope.uploader.onAfterAddingFile = function () {
       /* $scope.uploadProgress = 0;
        $scope.selectedFile = $files;*/
    	$scope.errorCDA = false;
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
			if (!$scope.errorCDA){
				$scope.showIFrame = true;
			}
		}, function(error){
			alert(error.status + " " + error.statusText);
		});
	}
	
	$scope.processResponse = function(object){
		try{
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
					$scope.testObject.patient = object.ClinicalDocument.recordTarget.patientRole.patient.name[0].family.content + " " + object.ClinicalDocument.recordTarget.patientRole.patient.name[0].given.content;
				}
				else{
					$scope.testObject.patient = object.ClinicalDocument.recordTarget.patientRole.patient.name[0].family + " " + object.ClinicalDocument.recordTarget.patientRole.patient.name[0].given;
				}
					
			}
			else{
				if (object.ClinicalDocument.recordTarget.patientRole.patient.name.family.content){
					$scope.testObject.patient = object.ClinicalDocument.recordTarget.patientRole.patient.name.family.content + " " + object.ClinicalDocument.recordTarget.patientRole.patient.name.given.content;
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
				if (!object.ClinicalDocument.author.assignedAuthor.assignedPerson){
					$scope.testObject.author = "unknown";
				}
				else{
					if (!object.ClinicalDocument.author.assignedAuthor.assignedPerson.name.family){
						if (typeof object.ClinicalDocument.author.assignedAuthor.representedOrganization.name === "string" || object.ClinicalDocument.author.assignedAuthor.representedOrganization.name instanceof String){
							$scope.testObject.author = object.ClinicalDocument.author.assignedAuthor.representedOrganization.name;
						}
						else
						{
							$scope.testObject.author = object.ClinicalDocument.author.assignedAuthor.assignedPerson.name;
						}
						
						return;
					}
					$scope.testObject.author = object.ClinicalDocument.author.assignedAuthor.assignedPerson.name.family;
					if (typeof object.ClinicalDocument.author.assignedAuthor.assignedPerson.name.given === 'string' || object.ClinicalDocument.author.assignedAuthor.assignedPerson.name.given instanceof String ){
						$scope.testObject.author = $scope.testObject.author + " " + object.ClinicalDocument.author.assignedAuthor.assignedPerson.name.given;
					}
					else
					{
						$scope.testObject.author = $scope.testObject.author + " " + object.ClinicalDocument.author.assignedAuthor.assignedPerson.name.given[0];
					}
				}
			}
			else{
				if (!object.ClinicalDocument.author[0].assignedAuthor.assignedPerson.name.family){
					$scope.testObject.author = object.ClinicalDocument.author[0].assignedAuthor.assignedPerson.name;
					return;
				}
				$scope.testObject.author = object.ClinicalDocument.author[0].assignedAuthor.assignedPerson.name.family;
				if (typeof object.ClinicalDocument.author[0].assignedAuthor.assignedPerson.name.given === 'string' || object.ClinicalDocument.author[0].assignedAuthor.assignedPerson.name.given instanceof String ){
					$scope.testObject.author =  $scope.testObject.author  + " " + object.ClinicalDocument.author[0].assignedAuthor.assignedPerson.name.given;
				}
				else
				{
					$scope.testObject.author =  $scope.testObject.author + " " + object.ClinicalDocument.author[0].assignedAuthor.assignedPerson.name.given[0];
				}
			}
		}
		catch(e){
			console.log(e);
			$scope.errorCDA = true;
		}
		
	}
	
	$scope.processSection = function(section){
		var found = false;
		var item = new Object();
		item['title'] = section.title;
		// process table section 
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
		
		// text contains content section
		if (section.text.content)
		{
			item['content'] = [];
			if (section.text.content instanceof String || typeof section.text.content === "string"){
				item['content'] = section.text.content;
			}
			else{
				if (section.text.content.length){
					for (var i = 0; i<section.text.content.length; i++){
						item['content'].push(section.text.content[i]);
					}
				}
				else if (section.text.content.content){
					item['content'].push(section.text.content.content);
				}
			}
			
			if (item.content.length == 0){
				item.content = "";
			}
			
			found = true;
		}
		
		// text contains list section
		if(section.text.list && !section.text.list.length){
			item['list'] = [];
			var listObject = new Object();
			// add list caption1
			if (section.text.list.caption){
				listObject['caption'] = section.text.list.caption;
			}
			listObject['listitem'] = [];
			// process following structure <list>/<item> - only one item
			if (section.text.list.item && !section.text.list.item.length){

				// check the possibility of having "<content>" in the item
				if (section.text.list.item.content && (typeof section.text.list.item.content==="string" || section.text.list.item.content instanceof String))
				{
					listObject['listitem'].push($scope.replaceCaret(section.text.list.item.content));
				}
				// there is no content but Item is string
				else if (typeof section.text.list.item == "string" || section.text.list.item instanceof String)
				{
					listObject['listitem'].push($scope.replaceCaret(section.text.list.item));
				}

			}
			else{
				// item has length but it is string <item>blabla</item>
				if (typeof section.text.list.item === 'string' || section.text.list.item instanceof String){
					listObject['listitem'].push($scope.replaceCaret(section.text.list.item));
				}
				// there are a lot of items inside the list : <list><item/><item/></list>
				else{
					for (var i = 0; i<section.text.list.item.length; i++){
						// item contains <content> section
						if (section.text.list.item[i].content && (typeof section.text.list.item[i].content==="string" || section.text.list.item[i].content instanceof String))
						{
							listObject['listitem'].push($scope.replaceCaret(section.text.list.item[i].content));
						}
						else if (section.text.list.item[i].length && !(typeof section.text.list.item[i]==="string" || section.text.list.item[i] instanceof String))
						{
							// there could be several 'content' elements in 'item'
							var contentItem = "";
							for (var j = 0; j< section.text.list.item[i].length; j++){
								contentItem = contentItem + " " + $scope.replaceCaret(section.text.list.item[i][j]);
							}
							
							listObject['listitem'].push(contentItem);
						}
						else
						{
							listObject['listitem'].push($scope.replaceCaret(section.text.list.item[i]));
						}
					}
				}
			}
			item['list'].push(listObject);
			found = true;
		}
		// process multiple lists
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
					listObject['listitem'].push($scope.replaceCaret(section.text.list.item));
				}
				else if (section.text.list[i].item && !section.text.list[i].item.length){
						listObject = this.processAdditionalLists(section.text.list[i].item);
						item['list'].push(listObject);
						complexSection = true;
					
				} else{
					for (var j = 0; j<section.text.list[i].item.length; j++){
						if (typeof section.text.list[i].item[j] === 'string' || section.text.list[i].item[j] instanceof String){
							listObject['listitem'].push($scope.replaceCaret(section.text.list[i].item[j]));
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
		
		if(section.text.paragraph){
			//item['paragraph'] = [];
			if (section.text.paragraph instanceof String || typeof section.text.paragraph == "string"){
				// there is only one paragraph in section so we need to add it to the list or table which were provided
				if (typeof item['list'] !="undefined"){
					item['list'][0]['paragraph'] = section.text.paragraph;
				}
				if (typeof item['table'] !="undefined"){
					item['table'][0]['paragraph'] = section.text.paragraph;
				}
			} 
			else{
				//there is many paragraphs  - usually their number equals to number of other elements. If not we skip paragraph section at all.
				if ((typeof item['list'] !="undefined" &&   section.text.paragraph.length == item['list'].length) || (typeof item['table'] !="undefined" &&   section.text.paragraph.length == item['table'].length) ){
					for(var i = 0; i < section.text.paragraph.length; i++){
						//item['paragraph'].push(section.text.paragraph[i]);
						if (typeof item['list'] !="undefined"){ // length of the paragraphs are equal to items
							item['list'][i]['paragraph'] = section.text.paragraph[i];
						}
						if (typeof item['table'] !="undefined"){
							item['table'][i]['paragraph'] = section.text.paragraph[i];
						}
					}
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
		listObject['caption'] = $scope.replaceCaret(complexItem.content);
		listObject['listitem'] = [];
		if (complexItem.list){
			if (typeof complexItem.list.item === 'string' || complexItem.list.item instanceof String){
				listObject['listitem'].push(complexItem.list.item);
			}
			else{
				for (var i= 0; i <  complexItem.list.item.length; i++){
					listObject['listitem'].push(complexItem.list.item[i]);
				}
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
				
				if (typeof item.thead.tr.th === 'string' || item.thead.tr.th instanceof String){ // there can be a simple string
					td.push({'text':item.thead.tr.th,'colspan':1 });
				}
				else if (!item.thead.tr.th.length){
					
						if (item.thead.tr.th.colspan){
							td.push({'text':item.thead.tr.th.content,'colspan':item.thead.tr.th.colspan });
						}
						else{
							td.push({'text':item.thead.tr.th.content,'colspan':1 });
						}
						
						if (item.thead.tr.td){
							if (item.thead.tr.td.colspan){
								td.push({'text':item.thead.tr.td.content,'colspan':item.thead.tr.td.colspan });
							}
							else{
								td.push({'text':item.thead.tr.td.content,'colspan':1 });
							}
						}
				}
				else {
					if (item.thead.tr.td){ // there could be td along with th in the tr 
						for (var i = 0; i< item.thead.tr.th.length; i++){
							if (typeof item.thead.tr.th[i] === 'string' || item.thead.tr.th[i] instanceof String){ // there can be a simple string
								td.push({'text':item.thead.tr.th[i],'colspan':1 });
								td.push({'text':item.thead.tr.td[i],'colspan':1 });
							}
							else{
								if (item.thead.tr.th[i].colspan){
									td.push({'text':item.thead.tr.th[i].content,'colspan':item.thead.tr.th[i].colspan });
									td.push({'text':item.thead.tr.td[i].content,'colspan':item.thead.tr.td[i].colspan });
								}
								else{
									td.push({'text':item.thead.tr.th[i].content,'colspan':1 });
									td.push({'text':item.thead.tr.td[i].content,'colspan':1 });
								}
							}
							
						}
					}
					else{
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
					
					if (typeof item.thead.tr[i].th === 'string' || item.thead.tr[i].th instanceof String){ // there can be a simple string
						td.push({'text':item.thead.tr[i].th,'colspan':1 });
					} 
					else if (!item.thead.tr[i].th.length){
						
							if (item.thead.tr[i].th.colspan){
								td.push({'text':item.thead.tr[i].th.content,'colspan':item.thead.tr[i].th.colspan });
							}
							else{
								td.push({'text':item.thead.tr[i].th.content,'colspan':1 });
							}
					}
					else {
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
		
		if (item.tbody == ""){
			tbody['tr'] = [];
			table['tbody'] = tbody;
		}
		else if (!item.tbody.tr.length){
			// refactoring 
			var td = $scope.processTR(item.tbody.tr);
			
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
				//var itemTR = item.tbody.tr[i]
				var td = $scope.processTR(item.tbody.tr[i]);
				
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
		
		// we need to add empty TD to the table body as there can be gaps in CDA
		if (typeof table.thead != 'undefined'){
			for (var i = 0; i< table.tbody.tr.length; i++){
				if (table.tbody.tr[i].td.length < table.thead.tr[table.thead.tr.length - 1].th.length && table.tbody.tr[i].td[0].colspan == 1){
					var initialBodyLength = table.tbody.tr[i].td.length;
					for(j = 0; j< table.thead.tr[table.thead.tr.length - 1].th.length - initialBodyLength; j++ ){
						table.tbody.tr[i].td.push({"text": "", "colspan": "1"});
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
		
		if (list.item.length && !(typeof list.item === 'string' || list.item instanceof String)){ // item can be simple string not containing the content section 
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
				if (typeof list.item[i] === 'string' || list.item[i] instanceof String){
					content.push( list.item[i]);
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
			
			if (typeof list.item === 'string' || list.item instanceof String){
				content.push( list.item);
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
	
	
	
	
	$scope.processTR = function(TRitem){
		var td = [];
		// tr contains TH 
		if (TRitem.th){
			if (typeof TRitem.th === 'string' || TRitem.th instanceof String){ // there can be a simple string
				td.push({'text':TRitem.th, 'colspan':1});
			}
			else if (TRitem.th.length){
				for (var i = 0; i< TRitem.th.length; i++){
					if (TRitem.th[i].colspan){
						td.push({'text':TRitem.th[i].content, 'colspan': TRitem.th[i].colspan});
					}
					else if (TRitem.th[i].content)
					{
						td.push({'text':TRitem.th[i].content, 'colspan':1});
					}
					else // just simple string
					{
						td.push({'text':TRitem.th[i], 'colspan':1});
					}
				}
			}
			else{	
				if (TRitem.th.colspan){
					td.push({'text':TRitem.th.content, 'colspan': TRitem.th.colspan});
				}
				else
				{
					td.push({'text':TRitem.th.content, 'colspan':1});
				}
			}
		}
		// tr contains TD
		if (TRitem.td){
			if (typeof TRitem.td === 'string' || TRitem.td instanceof String){ // there can be a simple string
				td.push({'text':TRitem.td, 'colspan':1});
			}
			// there can be a complex object
			else if (TRitem.td.content){
				if (TRitem.td.content.length && !(typeof TRitem.td.content === 'string' || TRitem.td.content instanceof String )){
					var tdContent = [];
					for (var i = 0; i< TRitem.td.content.length; i++){
						tdContent.push({"id":i, "text":$scope.replaceCaret(TRitem.td.content[i])});
					}
					
					if (TRitem.td.colspan){
						td.push({'paragraph':tdContent, 'colspan': TRitem.td.colspan}); 
					}
					else
					{
						td.push({'paragraph':tdContent, 'colspan':1});
					}
				}
				else{
					if (TRitem.td.colspan){
						td.push({'text':typeof TRitem.td.content.content === "undefined" ?TRitem.td.content:TRitem.td.content.content , 'colspan': TRitem.td.colspan}); // here is the crutch - parsing of the object returns content.content for <content>sdsd</content>
					}
					else
					{
						td.push({'text':typeof TRitem.td.content.content === "undefined" ?TRitem.td.content:TRitem.td.content.content, 'colspan':1});
					}
				}
			}
			else if (TRitem.td.paragraph){ // there could be <paragraph> inside TD 
				var tdContent = [];
				for (var i = 0; i< TRitem.td.paragraph.length; i++){
					tdContent.push({"id":i, "text":TRitem.td.paragraph[i]});
				}
				
				if (TRitem.td.colspan){
					td.push({'paragraph':tdContent, 'colspan': TRitem.td.colspan}); 
				}
				else
				{
					td.push({'paragraph':tdContent, 'colspan':1});
				}
			}
			else
			{
			for (var i = 0; i< TRitem.td.length; i++){
				var itemTD = TRitem.td[i];
				var found  = false;
				if (itemTD.length && typeof itemTD != 'string'){
					var tdContent = "";
					for(var j = 0; j< itemTD.length; j++ ){
						if (typeof itemTD[j] === 'string' || itemTD[j] instanceof String){
							tdContent = tdContent + " " +  itemTD[j];
						}
						else if (itemTD[j].content && (typeof itemTD[j].content === 'string' || itemTD[j].content instanceof String)){
							tdContent = tdContent + " " +  itemTD[j].content;
						}
					}
					
					td.push({'text': tdContent, 'colspan':typeof itemTD.colspan === "undefined" ? "1" : itemTD.colspan});
					found = true;
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
					td.push({'list': list, 'colspan':1});
					found = true;
				}
				
				if(itemTD['content']){
					if ((typeof itemTD.content === 'string' || itemTD.content instanceof String)){
						td.push({'text':itemTD['content'], 'colspan':typeof itemTD.colspan === "undefined" ? "1" : itemTD.colspan});
						found = true;
					}
					else if (itemTD.content.length)
					{
						var tdContent = "";
						for (var j  = 0; j< itemTD.content.length; j ++){
							if (typeof itemTD.content[j] === 'string' || itemTD.content[j] instanceof String){
								tdContent = tdContent + " " + itemTD.content[j]; 
							}
							else if (typeof itemTD.content[j].content === 'string' || itemTD.content[j].content instanceof String){
								tdContent = tdContent + " " + itemTD.content[j].content; 
							}
								
						}
						
						td.push({'text':tdContent, 'colspan':typeof itemTD.colspan === "undefined" ? "1" : itemTD.colspan});
						found = true;
					}
					else if (typeof itemTD.content.content === 'string' || itemTD.content.content instanceof String){
						td.push({'text':itemTD.content.content, 'colspan':typeof itemTD.colspan === "undefined" ? "1" : itemTD.colspan});
						found = true;
					}
					
				}
				
				if ((typeof itemTD['content'] == 'number' || !isNaN(itemTD['content'])) && !found ){
					td.push({'text':itemTD['content'], 'colspan':typeof itemTD.colspan === "undefined" ? "1" : itemTD.colspan});
					found = true;
				}
				
				if (itemTD['linkHtml']){
					td.push({'link': itemTD['linkHtml'], 'colspan':typeof itemTD.colspan === "undefined" ? "1" : itemTD.colspan});
					found = true;
				}
				
				if (!found){
					if (itemTD instanceof String || typeof itemTD === "string" || typeof itemTD === "number" || !isNaN(itemTD)){
						td.push({'text':itemTD, 'colspan':1});
					}
					else
					{
						td.push({'text':"", 'colspan':1});
					}
				}
				
			}
			}
		}
		return td;
	}
	
	
	$scope.replaceCaret = function(caretString){
		if (!(typeof caretString === 'string' || caretString instanceof String)){
			return caretString;
		}
		var returnString = caretString.replace(/&#13;/g, '\r\n').replace(/&#160;/g,' ');
		return returnString;
	}
	
});