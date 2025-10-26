package br.ufal.ic.odontolog.config;

import java.time.Duration;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "app.s3")
public class S3Properties {
  private Duration signedUrlTimeout;
  private Buckets buckets;

  @Data
  public static class Buckets {
    private String publicBucket;
    private String privateBucket;
  }
}
