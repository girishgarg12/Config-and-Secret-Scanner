package com.configscanner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ConfigScannerApplication {
	public static void main(String[] args) {
		System.setProperty("java.awt.headless", "false"); // Ensure GUI works
		SpringApplication.run(ConfigScannerApplication.class, args);
	}
}
