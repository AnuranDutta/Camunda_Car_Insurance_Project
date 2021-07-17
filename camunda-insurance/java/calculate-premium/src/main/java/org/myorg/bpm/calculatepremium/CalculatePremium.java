package org.myorg.bpm.calculatepremium;

import java.util.logging.Logger;
import java.awt.Desktop;
import java.net.URI;

import org.camunda.bpm.client.ExternalTaskClient;

public class CalculatePremium {
	private final static Logger LOGGER = Logger.getLogger(CalculatePremium.class.getName());

	  public static void main(String[] args) {
	    ExternalTaskClient client = ExternalTaskClient.create()
	        .baseUrl("http://localhost:8080/engine-rest")
	        .asyncResponseTimeout(10000) // long polling timeout
	        .build();

	    // subscribe to an external task topic as specified in the process
	    client.subscribe("calculate-premium")
	        .lockDuration(1000) // the default lock duration is 20 seconds, but you can override this
	        .handler((externalTask, externalTaskService) -> {
	          // Get a process variable
           	  String customerName = (String) externalTask.getVariable("customerName");
           	  Integer age = (Integer) externalTask.getVariable("age");
	          Integer carAge = (Integer) externalTask.getVariable("carAge");
	          Integer carPrice = (Integer) externalTask.getVariable("carPrice");
	          String carManufacturer = (String) externalTask.getVariable("carManufacturer");
	          Integer risk = (Integer) externalTask.getVariable("risk");
	          
//			  Calculation Part
// 			  carValue = carPrice - carAge percent of carPrice + risk percent of carPrice
//	          carIDV(insurance declared value) = 80% of carValue
//	          grossPremium = 2% of carIDV
//	          premium = grossPremium + 18% GST
	          float carValue = carPrice - carPrice*(float)(carAge/100) + carPrice*(float)(risk/100);
	          float carIDV = (float)carValue * 80/100;
	          float grossPremium = (float)carIDV * 2/100;
	          float premium = grossPremium + (float)grossPremium*(18/100);

	          LOGGER.info("Hi, "+age+" Years old "+ customerName + " with "+ carAge+" years old "+carManufacturer+" with risk = "+ risk+"...");
	          LOGGER.info("carValue: "+carValue+" carIDV:"+carIDV+" carPremium:"+premium+"...");

	          externalTaskService.complete(externalTask);
	        })
	        .open();
	  }
}
