//package com.bankcashpro;

import java.awt.AWTException;
import java.awt.Robot;
import java.awt.event.InputEvent;
import java.awt.event.KeyEvent;
import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.UnsupportedEncodingException;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class Utility
{
	
	public static void main(String[] args)
	{
		replaceTranslationText("D:/Development/CIB/prototype/SVN/trunk/CIB-BBE-Prototype/src/app/payments/transactions/single-payment-request/single-payment-initiate/single-payment-initiate.component.html");
	}
	
	private static void replaceTranslationText(String filePath)
	{
		try
		{
			String content = getFileText(filePath);
			content = addTranslation(content);
			//addTranslation(content);
			setFileText(filePath, content);
			
		}
		catch (IOException e)
		{
			e.printStackTrace();
		}
	}
	
	private static void addTranslationInLocal(final LinkedHashMap<String, String> addListMap)
	{
		final String filePath = "D:/Development/CIB/prototype/SVN/trunk/CIB-BBE-Prototype/utility/payment-locale.json";
		String content;
		try
		{
			content = getFileText(filePath);
			content = content.replace("{", "");
			content = content.replace("}", "");
			content = content.trim();
			
			final LinkedHashMap<String, String> existingMap = new LinkedHashMap<String, String>();
			if(!content.equals(""))
			{
				String object[] = content.split(",(?=(([^\"]*+\"){2})*+[^\"]*+$)");
				for (String string : object)
				{
					if(!string.equals(""))
					{
						String[] temp = string.split(":(?=(([^\"]*+\"){2})*+[^\"]*+$)");
						//string = string.replaceAll("\"", "");
						existingMap.put(temp[0].replaceAll("\"", "").trim(), temp[1].replaceAll("\"", "").trim());	
					}
				}
			}
			
			loopMap(addListMap, new LoopMapInterface()
			{
				@Override
				public void doWork(String key, String value)
				{
					key = key.trim();
					value = value.trim();
					existingMap.put(key, value);
				}

				@Override
				public void workDone()
				{
				}
			});
			
			loopMap(existingMap, new LoopMapInterface()
			{
				String concatString = "";
				@Override
				public void doWork(String key, String value)
				{
					key = key.replaceAll("\n", "");
					key = key.replaceAll("\t", "");
					key = key.replaceAll("\r", "");
					value = value.replaceAll("\n", "");
					value = value.replaceAll("\t", "");
					value = value.replaceAll("\r", "");
					concatString = concatString + ",\n\t\"" + key + "\" : \"" + value + "\"";
				}

				@Override
				public void workDone()
				{
					concatString = concatString.replaceFirst(",", "");
					concatString = "{" + concatString + "\n}";
					
					System.out.println(concatString);
					
					try
					{
						setFileText(filePath, concatString);
					}
					catch (FileNotFoundException e)
					{
						e.printStackTrace();
					}
					catch (UnsupportedEncodingException e)
					{
						e.printStackTrace();
					}
				}
			});
		}
		catch (IOException e)
		{
			e.printStackTrace();
		}
	}
	
	private static void setFileText(String filePath, String content) throws FileNotFoundException, UnsupportedEncodingException
	{
		PrintWriter writer = new PrintWriter(filePath, "UTF-8");
		writer.println(content);
		writer.close();
	}
	
	private static String getFileText(String filePath) throws IOException
	{
		BufferedReader reader = new BufferedReader(new FileReader(filePath));
		StringBuilder stringBuilder = new StringBuilder();
		String line = null;
		String ls = System.getProperty("line.separator");
		while ((line = reader.readLine()) != null) {
			stringBuilder.append(line);
			stringBuilder.append(ls);
		}
		// delete the last new line separator
		stringBuilder.deleteCharAt(stringBuilder.length() - 1);
		reader.close();

		return stringBuilder.toString();
	}
	
	private static String addTranslation(String htmString)
	{
		String pattern = ".*?";
		Pattern ptn = Pattern.compile("\\[\\["+pattern+"\\]\\]");
        Matcher mtch = ptn.matcher(htmString);

        LinkedHashMap<String, String> local_keys = new LinkedHashMap<String, String>();
        
		while(mtch.find()) 
		{
			String lable_value = "";
			String lable_key = "";
			String matched_lable = "";
			
			String matchStr = mtch.group().toString();
			matched_lable = matchStr;
			
			
			matchStr = matchStr.replaceAll("\\[\\[", "");
			matchStr = matchStr.replaceAll("\\]\\]", "");
			
			if(matchStr.contains("|"))
			{
				String[] temp = matchStr.split("\\|");
				lable_value = temp[0];
				lable_key = temp[1];
			}
			else
			{
				lable_value = matchStr;
				matchStr = matchStr.replace(" ", "_");
				matchStr = "lbl_" + matchStr;
				lable_key = matchStr.toLowerCase();	
			}
			
			lable_key = lable_key.trim();

			local_keys.put(lable_key, lable_value);
			String translationCode = "{{'"+lable_key+"' | translate}}"; 
			htmString = htmString.replace(matched_lable, translationCode);
		}
		
		addTranslationInLocal(local_keys);
		
		return htmString;
	}
	
	private static void loopMap(LinkedHashMap<String,String> local_keys, LoopMapInterface work)
	{
		for(Map.Entry<String, String> entry : local_keys.entrySet())
		{
			work.doWork(entry.getKey(), entry.getValue());
		}
		
		work.workDone();
	}
	
	interface LoopMapInterface
	{
		void doWork(String key, String value);
		void workDone();
	}
}
