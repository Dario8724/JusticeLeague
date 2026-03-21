package pt.app.JusticeLeague;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@org.springframework.scheduling.annotation.EnableAsync
public class JusticeLeagueApplication {

	public static void main(String[] args) {
		SpringApplication.run(JusticeLeagueApplication.class, args);
	}

}
