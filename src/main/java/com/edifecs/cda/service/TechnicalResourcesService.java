package com.edifecs.cda.service;

import java.io.File;
import java.nio.file.Files;
import org.apache.log4j.Logger;
import org.json.JSONObject;
import org.json.XML;
import org.springframework.stereotype.Service;


@Service
public class TechnicalResourcesService {
	
	final static Logger logger = Logger.getLogger(TechnicalResourcesService.class);
	
	
	public String getCDAJson(){
		String json = "";
		try{
			ClassLoader classLoader = getClass().getClassLoader();
			// USCH
			File file = new File(classLoader.getResource("XML\\xml.xml").getFile());
			String xml = new String(Files.readAllBytes(file.toPath()));
			JSONObject jsonObject = XML.toJSONObject(xml);
			json = jsonObject.toString(4).replaceAll("cda:", "");
			
		}
		catch(Exception e){
			e.printStackTrace();
		}
		
		return json;
	}
	
	public String getCDAJson(String xml){
		String json = "";
		try{
			JSONObject jsonObject = XML.toJSONObject(xml);
			json = jsonObject.toString(4).replaceAll("cda:", "");
			
		}
		catch(Exception e){
			e.printStackTrace();
		}
		
		return json;
	}
}
