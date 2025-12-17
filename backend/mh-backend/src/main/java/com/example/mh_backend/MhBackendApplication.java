package com.example.mh_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.ComponentScan;

@SpringBootApplication
@ComponentScan(basePackages = {"com.example.mh_backend", "com.application.signin"})
public class MhBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(MhBackendApplication.class, args);
	}

}
