package com.edifecs.cda.web;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import com.edifecs.cda.service.TechnicalResourcesService;


/**
 * Class representing base controller of the application
 * it processes initial request and returns App page.
 * @author Andrew Guselnikov (c-andrii.guselnikov@edifecs.com)
 *
 */
@Controller
public class HomeController 
{
	@Autowired
	TechnicalResourcesService techService;

    
    final static Logger logger = Logger.getLogger(HomeController.class);
	
	
	@RequestMapping(value = {"/","/home"}, method = RequestMethod.GET)
	public String application(Model model) {
		return "mainappview";
	}
	
	
	

	@RequestMapping(value = "/getCDAResource", method = RequestMethod.GET)
	@ResponseBody
	public String loadCDA(){
		return techService.getCDAJson();
	}
	
	
	/**
	 * Method processes POST request from FE, executes received file processing and return back answers in JSON form
	 * @param file a {@code MultipartFile} file with answers
	 * @return JSON answers as {@code String}
	 */
	@RequestMapping(value = "/uploadCDAFile", method = RequestMethod.POST)
	 @ResponseBody
	 public String uploadFileHandler(@RequestBody MultipartFile file)
	 {
		logger.debug("Getting CCD file from FE"); 
		String json = "";
		 if (!file.isEmpty()) 
		 {
			 try
			 {
				 logger.debug("Processing received CCD file");   
				 byte[] bytes = file.getBytes();
	               String xmlContent = new String(bytes, "UTF-8");
	               json  = this.techService.getCDAJson(xmlContent);
	         }
	         catch(Exception e)
	         {
	        	 logger.debug("Exception while processing CCD file: \n" + e.getMessage());
	        	 e.printStackTrace();
	         }
		 }
		 else{
			 logger.debug("File is empty"); 
		 }
		 return json;
	 }
	
}
